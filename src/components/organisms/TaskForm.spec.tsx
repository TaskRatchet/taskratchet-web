import TaskForm from './TaskForm'
import React from "react";
import {render, RenderResult} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";

global.document.createRange = () => ({
    setStart: () => {
    },
    setEnd: () => {
    },
    commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
    }
} as any)

interface RenderComponentProps {
    task?: string,
    due?: Date | null,
    cents?: number | null,
    timezone?: string,
    error?: string,
    onChange?: (task: string, due: Date | null, cents: number | null) => void,
    onSubmit?: () => void
}

const renderComponent = (props: RenderComponentProps = {}) => {
    const {
        task = '',
        due = null,
        cents = null,
        timezone = '',
        error = '',
        onChange = (task, due, cents) => {
        },
        onSubmit = () => {
        }
    } = props

    const result: RenderResult = render(
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <TaskForm {...{task, due, cents, timezone, error, onChange, onSubmit}} />
        </MuiPickersUtilsProvider>
    )

    return {
        ...result,
        taskInput: result.getByLabelText('Task *'),
        dueDateInput: result.getByLabelText('Due Date *'),
        dueTimeInput: result.getByLabelText('Due Time *'),
        centsInput: result.getByLabelText("Stakes *"),
    }
}

describe('TaskForm', () => {
    it('renders', async () => {
        await renderComponent()
    })

    it('has task input', async () => {
        const {getByLabelText} = await renderComponent()

        expect(getByLabelText('Task *')).toBeInTheDocument()
    })

    it('calls onChange when task modified', async () => {
        const onChange = jest.fn()

        const {taskInput} = await renderComponent({onChange})

        await userEvent.type(taskInput, "a")

        expect(onChange).toBeCalledWith('a', null, null)
    })

    it('calls onChange when due modified', async () => {
        const onChange = jest.fn()

        const {dueTimeInput} = await renderComponent({onChange})

        await userEvent.type(dueTimeInput, "{backspace}{backspace}AM")

        expect(onChange).toBeCalled()
    })

    it('calls onChange when cents modified', async () => {
        const onChange = jest.fn()

        const {centsInput} = await renderComponent({onChange})

        await userEvent.type(centsInput, "1")

        expect(onChange).toBeCalledWith('', null, 100)
    })
})

// TODO:
// remembers last stakes
// remembers last due
// allow deleting initial zero
// prevent entering date in the past
// prevent adding task where date and time is in the past
// allow using keyboard to modify date and time
