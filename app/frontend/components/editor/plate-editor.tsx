'use client';

import React from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate, usePlateEditor } from '@udecode/plate-common/react';
import { Value } from '@udecode/plate-common';

import {
  EDITOR_COMPONENTS,
  EDITOR_PLUGINS,
  // useCreateEditor,
} from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
// import { withPlaceholders } from '../plate-ui/placeholder';

interface PlateEditorProps {
  value?: Value | string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: Value) => void;
}

const normalizeToPlateValue = (
  inputValue: Value | string | undefined | null,
): Value | undefined => {
  if (inputValue === undefined || inputValue === null) return undefined;
  if (typeof inputValue === 'string')
    return [{ type: 'p', children: [{ text: inputValue }] }];
  return inputValue;
};

export function PlateEditor(props: PlateEditorProps) {
  const {
    value,
    placeholder = 'Type here...',
    readOnly = false,
    onChange,
  } = props;

  const editor = usePlateEditor({
    override: {
      // components: withPlaceholders(EDITOR_COMPONENTS),
      components: EDITOR_COMPONENTS,
    },
    plugins: EDITOR_PLUGINS,
    value: normalizeToPlateValue(value),
  });

  return (
    // <DndProvider backend={HTML5Backend}>
    <Plate
      editor={editor}
      onChange={(newValue) => (onChange ? onChange(newValue.value) : '')}
      readOnly={readOnly}
    >
      <EditorContainer>
        <Editor variant='none' placeholder={placeholder} />
      </EditorContainer>
    </Plate>
    // </DndProvider>
  );
}
