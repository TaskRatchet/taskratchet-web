import renderCompo

const renderComponent = (props: Partial<TaskFormProps> = {}) => {
	const p: TaskFormProps = {
		task: '',
		due: '1/1/2022, 11:59 PM',
		cents: 500,
		timezone: '',
		error: '',
		onChange: () => undefined,
		onSubmit: () => undefined,
		isLoading: false,
		...props,
	};

	const result: RenderResult = render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TaskForm {...p} />
		</LocalizationProvider>
	);

	return {
		...result,
		taskInput: result.getByLabelText('Task *') as HTMLInputElement,
		dueDateInput: result.getByLabelText('Due Date *') as HTMLInputElement,
		dueTimeInput: result.getByLabelText('Due Time *') as HTMLInputElement,
		centsInput: result.getByLabelText('Stakes *') as HTMLInputElement,
	};
};

describe('due form', () => {
    it('calls onChange when due modified', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = renderComponent({ onChange });

		await userEvent.type(dueTimeInput, '{backspace}{backspace}am');

		expect(onChange).toBeCalled();
	});

    it('preserves time when editing date', async () => {
		const onChange = jest.fn();

		const { dueDateInput } = renderComponent({
			due: '1/1/2021, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(dueDateInput, '{backspace}2{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: '',
				due: '1/1/2022, 11:59 PM',
				cents: 500,
			})
		);
	});

    it('preserves date when editing time', async () => {
		const onChange = jest.fn();

		const { dueTimeInput } = renderComponent({
			due: '1/1/2020, 11:59 PM',
			cents: 500,
			onChange,
		});

		await userEvent.type(dueTimeInput, '{backspace}M{enter}');

		expect(onChange).toBeCalledWith(
			expect.objectContaining({
				task: '',
				due: '1/1/2020, 11:59 PM',
				cents: 500,
			})
		);
	});
})