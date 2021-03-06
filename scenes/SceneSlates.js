import * as React from "react";
import * as SVG from "~/common/svg";
import * as Events from "~/common/custom-events";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { TabGroup, PrimaryTabGroup, SecondaryTabGroup } from "~/components/core/TabGroup";
import { ButtonSecondary } from "~/components/system/components/Buttons";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";

import ScenePage from "~/components/core/ScenePage";
import ScenePageHeader from "~/components/core/ScenePageHeader";
import SlatePreviewBlocks from "~/components/core/SlatePreviewBlock";
import SquareButtonGray from "~/components/core/SquareButtonGray";
import EmptyState from "~/components/core/EmptyState";
import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

// TODO(jim): Slates design.
export default class SceneSlates extends React.Component {
  _handleAdd = () => {
    this.props.onAction({
      name: "Create slate",
      type: "SIDEBAR",
      value: "SIDEBAR_CREATE_SLATE",
    });
  };

  _handleSearch = () => {
    Events.dispatchCustomEvent({
      name: "show-search",
      detail: {},
    });
  };

  render() {
    const tab = this.props.page.params?.tab || "collections";
    let subscriptions = this.props.viewer.subscriptions;

    return (
      <WebsitePrototypeWrapper
        title={`${this.props.page.pageTitle} • Slate`}
        url={`${Constants.hostname}${this.props.page.pathname}`}
      >
        <ScenePage>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
            <SecondaryTabGroup
              tabs={[
                { title: "My Collections", value: { tab: "collections" } },
                { title: "Subscribed", value: { tab: "subscribed" } },
              ]}
              value={tab}
              onAction={this.props.onAction}
              style={{ margin: 0 }}
            />
            <SquareButtonGray onClick={this._handleAdd} style={{ marginLeft: 16 }}>
              <SVG.Plus height="16px" />
            </SquareButtonGray>
          </div>
          {tab === "collections" ? (
            this.props.viewer.slates?.length ? (
              <SlatePreviewBlocks
                isOwner
                slates={this.props.viewer.slates}
                username={this.props.viewer.username}
                onAction={this.props.onAction}
              />
            ) : (
              <EmptyState>
                <FileTypeGroup />
                <div style={{ marginTop: 24 }}>
                  Use collections to create mood boards, share files, and organize research.
                </div>
                <ButtonSecondary onClick={this._handleAdd} style={{ marginTop: 32 }}>
                  Create collection
                </ButtonSecondary>
              </EmptyState>
            )
          ) : null}

          {tab === "subscribed" ? (
            subscriptions && subscriptions.length ? (
              <SlatePreviewBlocks
                slates={subscriptions}
                username={null}
                onAction={this.props.onAction}
              />
            ) : (
              <EmptyState>
                You can follow any public collections on the network.
                <ButtonSecondary onClick={this._handleSearch} style={{ marginTop: 32 }}>
                  Browse collections
                </ButtonSecondary>
              </EmptyState>
            )
          ) : null}
        </ScenePage>
      </WebsitePrototypeWrapper>
    );
  }
}
