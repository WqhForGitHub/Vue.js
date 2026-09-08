export default {
  namespaced: true,
  state: {
    flows: [
      {
        id: 1,
        name: '请假审批',
        steps: ['发起', '主管审批', 'HR审批', '完成'],
      },
      {
        id: 2,
        name: '报销审批',
        steps: ['发起', '主管审批', '财务审批', '完成'],
      },
    ],
    instances: [],
  },
  getters: {
    flowCount: (state) => state.flows.length,
    activeInstances: (state) => state.instances.filter((i) => i.status === 'running'),
  },
  mutations: {
    ADD_FLOW(state, flow) {
      state.flows.push({ ...flow, id: Date.now() });
    },
    START_INSTANCE(state, flowId) {
      const flow = state.flows.find((f) => f.id === flowId);
      if (flow) {
        state.instances.push({
          id: Date.now(),
          flowId,
          flowName: flow.name,
          currentStep: 0,
          status: 'running',
        });
      }
    },
    ADVANCE_STEP(state, instanceId) {
      const inst = state.instances.find((i) => i.id === instanceId);
      if (inst && inst.status === 'running') {
        inst.currentStep++;
        const flow = state.flows.find((f) => f.id === inst.flowId);
        if (flow && inst.currentStep >= flow.steps.length - 1) inst.status = 'done';
      }
    },
  },
  actions: {
    addFlow({ commit }, flow) {
      commit('ADD_FLOW', flow);
    },
    startInstance({ commit }, flowId) {
      commit('START_INSTANCE', flowId);
    },
    advanceStep({ commit }, instanceId) {
      commit('ADVANCE_STEP', instanceId);
    },
  },
};
