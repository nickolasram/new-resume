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
    givenInitialValue: string;
    setValue: Dispatch<SetStateAction<any>>;
}

const TextEditor = ({givenInitialValue, setValue}: ITextEditor) => {
    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    )
    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    )
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    const initialValue: Descendant[] = [
        {
            type: 'paragraph',
            children: [
                { text: givenInitialValue }
            ],
        }
    ]

    return (
        <Slate editor={editor} initialValue={initialValue}
        onChange={value => {
            const isAstChange = editor.operations.some(
              op => 'set_selection' !== op.type
            )
            if (isAstChange) {
              const content = JSON.stringify(value)
              setValue(content)
            }
          }}
        >
            <Toolbar>
                <MarkButton format="bold">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M4 3a1 1 0 0 1 1-1h6a4.5 4.5 0 0 1 3.274 7.587A4.75 4.75 0 0 1 11.25 18H5a1 1 0 0 1-1-1V3Zm2.5 5.5v-4H11a2 2 0 1 1 0 4H6.5Zm0 2.5v4.5h4.75a2.25 2.25 0 0 0 0-4.5H6.5Z"
                              clipRule="evenodd"/>
                    </svg>

                </MarkButton>
                <MarkButton format="italic">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M8 2.75A.75.75 0 0 1 8.75 2h7.5a.75.75 0 0 1 0 1.5h-3.215l-4.483 13h2.698a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3.215l4.483-13H8.75A.75.75 0 0 1 8 2.75Z"
                              clipRule="evenodd"/>
                    </svg>
                </MarkButton>
                <MarkButton format="underline">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M4.75 2a.75.75 0 0 1 .75.75V9a4.5 4.5 0 1 0 9 0V2.75a.75.75 0 0 1 1.5 0V9A6 6 0 0 1 4 9V2.75A.75.75 0 0 1 4.75 2ZM2 17.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                              clipRule="evenodd"/>
                    </svg>
                </MarkButton>
                <BlockButton format="heading-one">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <text textAnchor={'middle'} x={10} y={15} fontFamily={'sans-serif'} fontWeight={'semi-bold'}>H1</text>
                    </svg>
                </BlockButton>
                <BlockButton format="heading-two">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <text textAnchor={'middle'} x={10} y={15} fontFamily={'sans-serif'} fontWeight={'semi-bold'}>H2</text>
                    </svg>
                </BlockButton>
                <BlockButton format="heading-three">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <text textAnchor={'middle'} x={10} y={15} fontFamily={'sans-serif'} fontWeight={'semi-bold'}>H3</text>
                    </svg>
                </BlockButton>
                <BlockButton format="heading-four">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <text textAnchor={'middle'} x={10} y={15} fontFamily={'sans-serif'} fontWeight={'semi-bold'}>H4</text>
                    </svg>
                </BlockButton>
                <BlockButton format="heading-five">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <text textAnchor={'middle'} x={10} y={15} fontFamily={'sans-serif'} fontWeight={'semi-bold'}>H5</text>
                    </svg>
                </BlockButton>
                <BlockButton format="paragraph">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <text textAnchor={'middle'} x={10} y={15} fontFamily={'sans-serif'} fontWeight={'normal'}>P</text>
                    </svg>
                </BlockButton>
                <BlockButton format="block-quote">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path transform={'translate(-2,0)'} strokeWidth={2} stroke={'currentColor'} d="M3 5 9 5v6Q9 13 3.75 15 Q7.25 12 5.5 10h-2.25Z" />
                        <path transform={'translate(8,0)'} strokeWidth={2} stroke={'currentColor'} d="M3 5 9 5v6Q9 13 3.75 15 Q7.25 12 5.5 10h-2.25Z" />
                    </svg>

                </BlockButton>
                <BlockButton format="numbered-list">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path
                            d="M3 1.25a.75.75 0 0 0 0 1.5h.25v2.5a.75.75 0 0 0 1.5 0V2A.75.75 0 0 0 4 1.25H3ZM2.97 8.654a3.5 3.5 0 0 1 1.524-.12.034.034 0 0 1-.012.012L2.415 9.579A.75.75 0 0 0 2 10.25v1c0 .414.336.75.75.75h2.5a.75.75 0 0 0 0-1.5H3.927l1.225-.613c.52-.26.848-.79.848-1.371 0-.647-.429-1.327-1.193-1.451a5.03 5.03 0 0 0-2.277.155.75.75 0 0 0 .44 1.434ZM7.75 3a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5ZM7.75 9.25a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5ZM7.75 15.5a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5ZM2.625 13.875a.75.75 0 0 0 0 1.5h1.5a.125.125 0 0 1 0 .25H3.5a.75.75 0 0 0 0 1.5h.625a.125.125 0 0 1 0 .25h-1.5a.75.75 0 0 0 0 1.5h1.5a1.625 1.625 0 0 0 1.37-2.5 1.625 1.625 0 0 0-1.37-2.5h-1.5Z"/>
                    </svg>

                </BlockButton>
                <BlockButton format="bulleted-list">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z"
                              clipRule="evenodd"/>
                    </svg>

                </BlockButton>
                <BlockButton format="left">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z"
                              clipRule="evenodd"/>
                    </svg>

                </BlockButton>
                <BlockButton format="center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                              clipRule="evenodd"/>
                    </svg>
                </BlockButton>
                <BlockButton format="right">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd"
                              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm7 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z"
                              clipRule="evenodd"/>
                    </svg>

                </BlockButton>
            </Toolbar>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                spellCheck
                // autoFocus
                className={'w-196.5 border-1 border-black pl-3 h-[10em] overflow-y-auto'}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as never)) {
                            event.preventDefault()
                            const mark = HOTKEYS[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                }}
            />
        </Slate>
    )
}

export default TextEditor