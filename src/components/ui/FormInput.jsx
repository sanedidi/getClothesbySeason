
import { Input } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

const FormInput = ({
	control,
	required = false,
	name,
	inputProps = {},
	disabled = false,
	inputLeftElement,
	inputRightElement,
	defaultValue = '',
	placeholder = '',
	autoFocus = false,
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={{ required }}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<>
					<Input
						value={value}
						onChange={onChange}
						readOnly={disabled}
						placeholder={placeholder}
						autoFocus={autoFocus}
						{...props}
						required={false}
					/>
				</>
			)}
		/>
	);
};

export default FormInput;
