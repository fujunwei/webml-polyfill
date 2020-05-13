// Generated file (from: conv_float.mod.py). Do not edit
describe('CTS', function() {
    const assert = chai.assert;
    const nn = navigator.ml.getNeuralNetworkContext();
  
    it('check result for Conv float example', async function() {
      // For 'Conv float' example: examples
      let model = await nn.createModel(options);
      let operandIndex = 0;
  
      let op1_value = [1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0];
      let op4_expect = [0.875, 0.875, 0.875, 0.875];
  
      let type0 = {type: nn.TENSOR_FLOAT32, dimensions: [1, 3, 3, 1]};
      let type0_length = product(type0.dimensions);
      let type1 = {type: nn.TENSOR_FLOAT32, dimensions: [1, 2, 2, 1]};
      let type1_length = product(type1.dimensions);
      let type2 = {type: nn.TENSOR_FLOAT32, dimensions: [1]};
      let type2_length = product(type2.dimensions);
      let type3 = {type: nn.INT32};
  
      let op1 = operandIndex++;
      model.addOperand(type0);
      let op2 = operandIndex++;
      model.addOperand(type1);
      let op3 = operandIndex++;
      model.addOperand(type2);
      let pad0 = operandIndex++;
      model.addOperand(type3);
      let pad1 = operandIndex++;
      model.addOperand(type3);
      let stride = operandIndex++;
      model.addOperand(type3);
      let act = operandIndex++;
      model.addOperand(type3);
      let op4 = operandIndex++;
      model.addOperand(type0);
  
      model.setOperandValue(op2, new Float32Array([0.25, 0.25, 0.25, 0.25]));
      model.setOperandValue(op3, new Float32Array([0]));
      model.setOperandValue(pad0, new Int32Array([0]));
      model.setOperandValue(pad1, new Int32Array([1]));
      model.setOperandValue(stride, new Int32Array([1]));
      model.setOperandValue(act, new Int32Array([0]));
      model.addOperation(nn.CONV_2D, [op1, op2, op3, pad0, pad1, pad0, pad1, stride, stride, act], [op4]);
  
      model.identifyInputsAndOutputs([op1], [op4]);
      await model.finish();
  
      let compilation = await model.createCompilation();
      compilation.setPreference(getPreferenceCode(options.prefer));
      await compilation.finish();
  
      let execution = await compilation.createExecution();
  
      let op1_input = new Float32Array(op1_value);
      execution.setInput(0, op1_input);
      let op4_output = new Float32Array(type0_length);
      execution.setOutput(0, op4_output);
  
      await execution.startCompute();
  
      for (let i = 0; i < type0_length; ++i) {
        assert.isTrue(almostEqualCTS(op4_output[i], op4_expect[i]));
      }
    });
  });
  