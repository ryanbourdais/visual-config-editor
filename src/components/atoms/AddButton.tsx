import { ButtonHTMLAttributes } from 'react';
import AddIcon from '../../icons/ui/AddIcon';

const AddButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={'bg-circle-gray-300 h-10 w-14 rounded ' + props.className}
    >
      <AddIcon className="m-auto"></AddIcon>
    </button>
  );
};

export default AddButton;
