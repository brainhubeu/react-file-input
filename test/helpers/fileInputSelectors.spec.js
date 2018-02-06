import { selectIsDragging, selectIsDraggingOver } from '../../src/helpers/fileInputSelectors';

describe('helperas', () => {
  describe('fileInputSelectors', () => {
    describe('selectIsDragging', () => {
      it('should only return true if the dragging entered more times than it left', () => {
        expect(selectIsDragging({ enteredInDocument: 0, isOver: 0 })).toBeFalsy();
        expect(selectIsDragging({ enteredInDocument: 1, isOver: 0 })).toBeTruthy();
        expect(selectIsDragging({ enteredInDocument: 0, isOver: 1 })).toBeTruthy();
        expect(selectIsDragging({ enteredInDocument: 1, isOver: 1 })).toBeTruthy();
      });
    });
    describe('selectIsDraggingOver', () => {
      it('should only return true if the dragging entered more times than it left in the FileInput', () => {
        expect(selectIsDraggingOver({ enteredInDocument: 0, isOver: 0 })).toBeFalsy();
        expect(selectIsDraggingOver({ enteredInDocument: 1, isOver: 0 })).toBeFalsy();
        expect(selectIsDraggingOver({ enteredInDocument: 0, isOver: 1 })).toBeTruthy();
      });
    });
  });
});
