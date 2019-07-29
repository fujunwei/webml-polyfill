describe('CTS', function() {
  const assert = chai.assert;
  const nn = navigator.ml.getNeuralNetworkContext();

  it('check result for Add example', async function() {
    let model = await nn.createModel(options);
    let operandIndex = 0;

    let op1_value = [1.0, 2.0, 3, 4, 5, 6, 7, 8,9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    let op2_value = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    let op7_expect = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];

    let type1 = {type: nn.INT32};
    let type0 = {type: nn.TENSOR_FLOAT32, dimensions: [1, 2, 3, 4]};
    let type0_length = product(type0.dimensions);

    let op1 = operandIndex++;
    model.addOperand(type0);
    let op2 = operandIndex++;
    model.addOperand(type0);
    let act = operandIndex++;
    model.addOperand(type1);
    let op3 = operandIndex++;
    model.addOperand(type0);
    // second add operation.
    let op4 = operandIndex++;
    model.addOperand(type0);
    let op5 = operandIndex++;
    model.addOperand(type0);
    let op6 = operandIndex++;
    model.addOperand(type0);
    let op7 = operandIndex++;
    model.addOperand(type0);

    model.setOperandValue(act, new Int32Array([0]));

    let op2_input = new Float32Array(op2_value);
    model.setOperandValue(op2, op2_input);
    model.addOperation(nn.ADD, [op1, op2, act], [op3]);

    let op5_input = new Float32Array(24);
    model.setOperandValue(op5, op5_input);
    model.addOperation(nn.ADD, [op4, op5, act], [op6]);

    model.addOperation(nn.ADD, [op3, op6, act], [op7]);

    model.identifyInputsAndOutputs([op1, op4], [op7]);

    await model.finish();

    let compilation = await model.createCompilation();
    compilation.setPreference(getPreferenceCode(options.prefer));
    await compilation.finish();

    let execution = await compilation.createExecution();

    let op1_input = new Float32Array(op1_value);
    let op4_input = new Float32Array(24);
    execution.setInput(0, op1_input);
    execution.setInput(1, op4_input);

    let op7_output = new Float32Array(type0_length);
    execution.setOutput(0, op7_output);

    await execution.startCompute();

    for (let i = 0; i < type0_length; ++i) {
      assert.isTrue(almostEqualCTS(op7_output[i], op7_expect[i]));
    }

    // await execution.startCompute();

    // for (let i = 0; i < type0_length; ++i) {
    //   assert.isTrue(almostEqualCTS(op7_output[i], op7_expect[i]));
    // }
  });
});
