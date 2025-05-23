/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { BulkCreateOperation, BulkIndexOperation } from '@elastic/elasticsearch/lib/api/types';
import { Fields } from '../lib/entity';
import { Serializable } from '../lib/serializable';

export type SynthtraceESAction = { create: BulkCreateOperation } | { index: BulkIndexOperation };
export type SynthtraceDynamicTemplate = Record<string, string>;

export type ESDocumentWithOperation<TFields extends Fields> = {
  _index?: string;
  _action?: SynthtraceESAction;
  _dynamicTemplates?: SynthtraceDynamicTemplate;
} & TFields;

export type SynthtraceGenerator<TFields extends Fields> = Generator<Serializable<TFields>>;

export type SynthtraceProcessor<TFields extends Fields> = (
  fields: ESDocumentWithOperation<TFields>
) => ESDocumentWithOperation<TFields>;
