import TaskForm from './TaskForm'
import React from "react";
import {render, RenderResult} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

    const result: RenderResult = render(<TaskForm {...{task, due, cents, timezone, error, onChange, onSubmit}} />)

    // @ts-ignore
    const dueInput = result.getByText("Due")
        .firstElementChild
        .firstElementChild
        .firstElementChild

    if (!dueInput) {
        throw Error("Missing due input")
    }

    return {
        ...result,
        taskInput: result.getByLabelText('Task *'),
        dueInput,
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

        const {dueInput} = await renderComponent({onChange})

        await userEvent.type(dueInput, "{backspace}{backspace}AM")

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
