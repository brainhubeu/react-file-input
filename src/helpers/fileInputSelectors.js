/* If entered more times than left in document or wrapper return true */
export const selectIsDragging = ({ enteredInDocument, isOver }) => enteredInDocument > 0 || isOver > 0;

/* If entered more times than left in the wrapper return true */
export const selectIsDraggingOver = ({ isOver }) => isOver > 0;
