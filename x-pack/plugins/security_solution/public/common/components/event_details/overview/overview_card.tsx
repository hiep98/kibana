/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer, EuiText } from '@elastic/eui';
import React from 'react';

import { ActionCell } from '../table/action_cell';
import { euiStyled } from '../../../../../../../../src/plugins/kibana_react/common';
import { EnrichedFieldInfo } from '../types';

const OverviewPanel = euiStyled(EuiPanel)`
  &&& {
    background-color: ${({ theme }) => theme.eui.euiColorLightestShade};
    max-height: 87px;
  }

  & {
    .hoverActions-active {
      .timelines__hoverActionButton,
      .securitySolution__hoverActionButton {
        opacity: 1;
      }
    }

    &:hover {
      .timelines__hoverActionButton,
      .securitySolution__hoverActionButton {
        opacity: 1;
      }
    }
  }
`;

interface OverviewCardProps {
  title: string;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ title, children }) => (
  <OverviewPanel borderRadius="none" hasShadow={false} hasBorder={false} paddingSize="s">
    <EuiText size="s">{title}</EuiText>
    <EuiSpacer size="s" />
    {children}
  </OverviewPanel>
);

OverviewCard.displayName = 'OverviewCard';

const ClampedContent = euiStyled.div`
  /* Clamp text content to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

ClampedContent.displayName = 'ClampedContent';

type OverviewCardWithActionsProps = OverviewCardProps & {
  contextId: string;
  enrichedFieldInfo: EnrichedFieldInfo;
};

export const OverviewCardWithActions: React.FC<OverviewCardWithActionsProps> = ({
  title,
  children,
  contextId,
  enrichedFieldInfo,
}) => {
  return (
    <OverviewCard title={title}>
      <EuiFlexGroup alignItems="flexEnd" gutterSize="s">
        <EuiFlexItem grow={false}>
          <ClampedContent>{children}</ClampedContent>
        </EuiFlexItem>
        <EuiFlexItem>
          <ActionCell {...enrichedFieldInfo} contextId={contextId} applyWidthAndPadding={false} />
        </EuiFlexItem>
      </EuiFlexGroup>
    </OverviewCard>
  );
};

OverviewCardWithActions.displayName = 'OverviewCardWithActions';
