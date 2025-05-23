/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC, PropsWithChildren } from 'react';
import React, { memo, Fragment } from 'react';
import { FormattedMessage } from '@kbn/i18n-react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiHorizontalRule,
  EuiSpacer,
  useEuiTheme,
  COLOR_MODES_STANDARD,
} from '@elastic/eui';
import type { SplitField } from '@kbn/ml-anomaly-utils';
import { JOB_TYPE } from '../../../../../../../../../common/constants/new_job';

interface Props {
  fieldValues: string[];
  splitField: SplitField;
  numberOfDetectors: number;
  jobType: JOB_TYPE;
  animate?: boolean;
}

interface Panel {
  panel: HTMLDivElement;
  marginBottom: number;
}

export const SplitCards: FC<PropsWithChildren<Props>> = memo(
  ({ fieldValues, splitField, children, numberOfDetectors, jobType, animate = false }) => {
    const { euiTheme, colorMode } = useEuiTheme();
    const panels: Panel[] = [];

    const isLightTheme = colorMode === COLOR_MODES_STANDARD.light;

    const splitCardStyle = {
      ...(isLightTheme ? { border: euiTheme.border.thin } : {}),
      paddingTop: euiTheme.size.xs,
    };

    function storePanels(panel: HTMLDivElement | null, marginBottom: number) {
      if (panel !== null) {
        if (animate === false) {
          panel.style.marginBottom = `${marginBottom}px`;
        }
        panels.push({ panel, marginBottom });
      }
    }

    function getBackPanels() {
      panels.length = 0;

      const fieldValuesCopy = [...fieldValues];
      fieldValuesCopy.shift();

      let margin = 5;
      const sideMargins = fieldValuesCopy.map((f, i) => (margin += 10 - i)).reverse();

      if (animate === true) {
        setTimeout(() => {
          panels.forEach((p) => (p.panel.style.marginBottom = `${p.marginBottom}px`));
        }, 100);
      }

      const SPACING = 100;
      const SPLIT_HEIGHT_MULTIPLIER = 1.6;
      return fieldValuesCopy.map((fieldName, i) => {
        const diff = (i + 1) * (SPLIT_HEIGHT_MULTIPLIER * (10 / fieldValuesCopy.length));
        const marginBottom = -SPACING + diff;

        const sideMargin = sideMargins[i];

        const style = {
          height: `${SPACING}px`,
          marginBottom: `-${SPACING}px`,
          marginLeft: `${sideMargin}px`,
          marginRight: `${sideMargin}px`,
          ...(animate ? { transition: 'margin 0.5s' } : {}),
        };
        return (
          <div key={fieldName} ref={(ref) => storePanels(ref, marginBottom)} css={style}>
            <EuiPanel paddingSize="m" css={splitCardStyle} data-test-subj="mlSplitCard back">
              <div
                css={{ fontWeight: 'bold', fontSize: 'small' }}
                data-test-subj="mlSplitCardTitle"
              >
                {fieldName}
              </div>
            </EuiPanel>
          </div>
        );
      });
    }

    return (
      <>
        <EuiFlexGroup>
          <EuiFlexItem data-test-subj="mlDataSplit">
            {(fieldValues.length === 0 || numberOfDetectors === 0) && <>{children}</>}
            {fieldValues.length > 0 && numberOfDetectors > 0 && splitField !== null && (
              <Fragment>
                {(jobType === JOB_TYPE.MULTI_METRIC || jobType === JOB_TYPE.GEO) && (
                  <Fragment>
                    <div
                      css={{ fontSize: 'small' }}
                      data-test-subj={`mlDataSplitTitle ${splitField.name}`}
                    >
                      <FormattedMessage
                        id="xpack.ml.newJob.wizard.pickFieldsStep.splitCards.dataSplitBy"
                        defaultMessage="Data split by {field}"
                        values={{ field: splitField.name }}
                      />
                    </div>
                    <EuiSpacer size="m" />
                  </Fragment>
                )}

                {getBackPanels()}
                <EuiPanel paddingSize="m" css={splitCardStyle} data-test-subj="mlSplitCard front">
                  <div
                    css={{ fontWeight: 'bold', fontSize: 'small' }}
                    data-test-subj="mlSplitCardTitle"
                  >
                    {fieldValues[0]}
                  </div>
                  <EuiHorizontalRule margin="s" />
                  <>{children}</>
                </EuiPanel>
              </Fragment>
            )}
          </EuiFlexItem>
        </EuiFlexGroup>
        {splitField !== null ? <EuiSpacer size="m" /> : null}
      </>
    );
  }
);
