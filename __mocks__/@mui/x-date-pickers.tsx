import React from 'react';

function makePicker({
	formatValue,
	parseValue,
}: {
	formatValue: (value: Date) => string;
	parseValue: (value: string) => Date;
}) {
	return function MockPicker(p: any) {
		const [value, setValue] = React.useState(formatValue(p.value));
		return p.renderInput({
			label: p.label,
			value,
			onChange: (e: any) => {
				setValue(e.target.value);
				p.onChange({
					$d: parseValue(e.target.value),
				});
			},
			...p.InputProps,
		});
	};
}

const DatePicker = makePicker({
	formatValue: (value: Date) => {
		// MM/DD/YYYY
		return value.toLocaleDateString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	},
	parseValue: (value: string) => {
		const [month, day, year] = value.split('/').map(Number);
		return new Date(year, month - 1, day);
	},
});

const TimePicker = makePicker({
	formatValue: (value: Date) => {
		// hh:mm A
		return value.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	},
	parseValue: (value: string) => {
		// hh:mm A
		// example: "12:00 AM"
		const ampm = value.slice(-2);
		const [hour, minute] = value.slice(0, -2).split(':').map(Number);
		const hours = ampm === 'AM' ? hour : hour + 12;
		return new Date(0, 0, 0, hours, minute);
	},
});

export { DatePicker, TimePicker };
