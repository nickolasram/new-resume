// "use client"
// import React, { useMemo } from 'react'
// import { createEditor, Descendant } from 'slate'
// import { Slate, Editable, withReact } from 'slate-react'
//
// const SlateTextArea = ({value}:{value:Descendant[]}) => {
//     const editor = useMemo(() => withReact(createEditor()), [])
//     return (
//         <Slate editor={editor} initialValue={value}>
//             <Editable
//                 className="bg-white text-black"
//                 readOnly
//                 placeholder="Enter some plain text..." />
//         </Slate>
//     )
// }
//
// export default SlateTextArea
"use client"

import {BaseEditor, Descendant, Editor, Element as SlateElement, Transforms, Range} from "slate";
import {ReactEditor, useSlate} from "slate-react";
import {HistoryEditor} from "slate-history";
import React, {Dispatch, forwardRef, MutableRefObject, PropsWithChildren, Ref, SetStateAction} from "react";
import isHotkey from 'is-hotkey'
import { BaseRange, createEditor } from 'slate'
import { Editable, RenderElementProps, RenderLeafProps, Slate, withReact,} from 'slate-react'
import { KeyboardEvent, useCallback, useMemo} from 'react'
import { withHistory } from 'slate-history'

type EmptyText = {
    text: string
}

type BlockQuoteElement = {
    type: 'block-quote'
    align?: string
    children: Descendant[]
}

type BulletedListElement = {
    type: 'bulleted-list'
    align?: string
    children: Descendant[]
}

type EditableVoidElement = {
    type: 'editable-void'
    children: EmptyText[]
}

type HeadingElement = {
    type: 'heading-one'
    align?: string
    children: Descendant[]
}

type HeadingTwoElement = {
    type: 'heading-two'
    align?: string
    children: Descendant[]
}

type HeadingThreeElement = {
    type: 'heading-three'
    align?: string
    children: Descendant[]
}

type HeadingFourElement = {
    type: 'heading-four'
    align?: string
    children: Descendant[]
}

type HeadingFiveElement = {
    type: 'heading-five'
    align?: string
    children: Descendant[]
}

type HeadingSixElement = {
    type: 'heading-six'
    align?: string
    children: Descendant[]
}

type LinkElement = { type: 'link'; url: string; children: Descendant[] }

type ButtonElement = { type: 'button'; children: Descendant[] }

type ListItemElement = { type: 'list-item'; children: Descendant[] }

type NumberedListItemElement = {
    type: 'numbered-list'
    children: Descendant[]
}

type ParagraphElement = {
    type: 'paragraph'
    align?: string
    children: Descendant[]
}

type TitleElement = { type: 'title'; children: Descendant[] }

type CodeBlockElement = {
    type: 'code-block'
    language: string
    children: Descendant[]
}

type CodeLineElement = {
    type: 'code-line'
    children: Descendant[]
}

export type CustomElementWithAlign =
    | ParagraphElement
    | HeadingElement
    | HeadingTwoElement
    | HeadingThreeElement
    | HeadingFourElement
    | HeadingFiveElement
    | HeadingSixElement
    | BlockQuoteElement
    | BulletedListElement

export type CustomElement =
    | BlockQuoteElement
    | BulletedListElement
    | EditableVoidElement
    | HeadingElement
    | HeadingTwoElement
    | HeadingThreeElement
    | HeadingFourElement
    | HeadingFiveElement
    | HeadingSixElement
    | LinkElement
    | ButtonElement
    | ListItemElement
    | NumberedListItemElement
    | ParagraphElement
    | TitleElement
    | CodeBlockElement
    | CodeLineElement

export type CustomElementType = CustomElement['type']

export type CustomText = {
    bold?: boolean
    italic?: boolean
    code?: boolean
    underline?: boolean
    strikethrough?: boolean
    // MARKDOWN PREVIEW SPECIFIC LEAF
    underlined?: boolean
    title?: boolean
    list?: boolean
    hr?: boolean
    blockquote?: boolean
    text: string
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>

export type CustomEditor = BaseEditor &
    ReactEditor &
    HistoryEditor & {
    nodeToDecorations?: Map<SlateElement, Range[]>
}

export interface BaseProps {
    [key: string]: unknown
}

// eslint-disable-next-line react/display-name
const Button = forwardRef(
    (
        {
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean
                reversed?: boolean
                onClick?: () => void
            }
            // & BaseProps
        >,
        ref: Ref<HTMLButtonElement>
    ) => (
        <button
            type='button'
            {...props}
            ref={ref}
            className={'cursor-pointer border-l-1 first:border-l-0 py-0.5 px-2 border-gray-800'}
        />
    )
)

// eslint-disable-next-line react/display-name
export const Toolbar = forwardRef(
    (
        { ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<HTMLDivElement>
    ) => (
        <div
            {...props}
            data-test-id="menu"
            ref={ref}
            className={'flex p-1 bg-gray-300 w-min border-1 border-gray-400 border-b-0'}
        />
    )
)

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const
const TEXT_ALIGN_TYPES = ['left', 'center', 'right'] as const

export type AlignType = (typeof TEXT_ALIGN_TYPES)[number]
type ListType = (typeof LIST_TYPES)[number]
type CustomElementFormat = CustomElementType | AlignType | ListType


const isBlockActive = (
    editor: CustomEditor,
    format: CustomElementFormat,
    blockType: 'type' | 'align' = 'type'
) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n => {
                if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
                    if (blockType === 'align' && isAlignElement(n)) {
                        return n.align === format
                    }
                    return n.type === format
                }
                return false
            },
        })
    )

    return !!match
}

const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
    const isActive = isBlockActive(
        editor,
        format,
        isAlignType(format) ? 'align' : 'type'
    )

    const isList = isListType(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            isListType(n.type) &&
            !isAlignType(format),
        split: true,
    })
    let newProperties: Partial<SlateElement>
    if (isAlignType(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            type: isActive ? format : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

export const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}



interface BlockButtonProps {
    format: CustomElementFormat
    children: React.ReactNode
}

export const BlockButton = ({ format, children }: BlockButtonProps) => {
    const editor = useSlate()
    return (
        <Button
            active={isBlockActive(
                editor,
                format,
                isAlignType(format) ? 'align' : 'type'
            )}
            onClick={() => {
                toggleBlock(editor, format)
            }}
            data-test-id={`block-button-${format}`}
        >
            {children}
        </Button>
    )
}

interface MarkButtonProps {
    format: CustomTextKey
    children: React.ReactNode
}

export const MarkButton = ({ format, children }: MarkButtonProps) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onClick={() => toggleMark(editor, format)} reversed={false}        >
            {children}
        </Button>
    )
}

export const isAlignType = (format: CustomElementFormat): format is AlignType => {
    return TEXT_ALIGN_TYPES.includes(format as AlignType)
}

export const isListType = (format: CustomElementFormat): format is ListType => {
    return LIST_TYPES.includes(format as ListType)
}

export const isAlignElement = (
    element: CustomElement
): element is CustomElementWithAlign => {
    return 'align' in element
}

declare module 'slate' {
    interface CustomTypes {
        Editor: CustomEditor
        Element: CustomElement
        Text: CustomText
        Range: BaseRange & {
            [key: string]: unknown
        }
    }
}

const HOTKEYS: Record<string, CustomTextKey> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
    const style: React.CSSProperties = {}
    if (isAlignElement(element)) {
        style.textAlign = element.align as AlignType
    }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes} className={'bg-gray-300 max-w-[98.5%] px-4'}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 style={style} {...attributes} className={'capitalize font-bold text-center'}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 style={style} {...attributes} className={'capitalize font-bold'}>
                    {children}
                </h2>
            )
        case 'heading-three':
            return (
                <h2 style={style} {...attributes} className={'capitalize font-bold italic'}>
                    {children}
                </h2>
            )
        case 'heading-four':
            return (
                <h4 style={style} {...attributes} className={'capitalize font-bold indent-4'}>
                    {children}
                </h4>
            )
        case 'heading-five':
            return (
                <h5 style={style} {...attributes} className={'capitalize font-bold italic indent-4'}>
                    {children}
                </h5>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

interface ITextEditor {
    value: Descendant[];
    areaColor: string;
    textColor: string;
}

const SlateTextEditor = ({value, areaColor, textColor}: ITextEditor) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    )
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    )
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    return (
        <Slate editor={editor} initialValue={value}>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                readOnly
                placeholder="Enter some rich text…"
                spellCheck
                className={'w-[100%] text-wrap wrap-anywhere'}
                style={{
                    backgroundColor: areaColor,
                    color: textColor,
                }}
            />
        </Slate>
    )
}

export default SlateTextEditor