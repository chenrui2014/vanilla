/*
 * @author Stéphane LaFlèche <stephane.l@vanillaforums.com>
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import React, { ReactNode } from "react";
import classNames from "classnames";
import Paragraph from "../Paragraph";
import { getRequiredID, IOptionalComponentID } from "@library/componentIDs";
import { IFieldError } from "@library/@types/api/core";
import ErrorMessages from "./ErrorMessages";
import { inputBlockClasses } from "@library/styles/inputBlockStyles";

interface ICallbackProps {
    labelID: string;
    hasErrors: boolean;
    errorID: string;
}
type CallbackChildren = (props: ICallbackProps) => React.ReactNode;

export interface IInputBlockProps extends IOptionalComponentID {
    label: ReactNode;
    children: JSX.Element | CallbackChildren;
    className?: string;
    labelClassName?: string;
    noteAfterInput?: string;
    labelNote?: string;
    labelID?: string;
    descriptionID?: string;
    errors?: IFieldError[];
    legacyMode?: boolean;
}

interface IState {
    id: string;
}

export default class InputBlock extends React.Component<IInputBlockProps, IState> {
    public static defaultProps = {
        errors: [],
    };

    public constructor(props: IInputBlockProps) {
        super(props);
        this.state = {
            id: getRequiredID(props, "inputText") as string,
        };
    }

    public render() {
        const classes = inputBlockClasses();
        const hasErrors = !!this.props.errors && this.props.errors.length > 0;

        let children;
        if (typeof this.props.children === "function") {
            children = this.props.children({ hasErrors, errorID: this.errorID, labelID: this.labelID });
        } else {
            children = this.props.children;
        }

        return (
            <label className={classNames("inputBlock", classes.root, this.props.className)}>
                <span
                    id={this.labelID}
                    className={classNames(classes.labelAndDescription, "inputBlock-labelAndDescription")}
                >
                    <span className={classNames("inputBlock-labelText", classes.labelText, this.props.labelClassName)}>
                        {this.props.label}
                    </span>
                    <Paragraph
                        className={classNames("inputBlock-labelNote", classes.labelNote)}
                        children={this.props.labelNote}
                    />
                </span>

                <span className={classNames("inputBlock-inputWrap", classes.inputWrap)}>{children}</span>
                <Paragraph
                    className={classNames("inputBlock-labelNote", classes.labelNote)}
                    children={this.props.noteAfterInput}
                />
                <ErrorMessages
                    id={this.errorID}
                    errors={this.props.errors}
                    className={classes.errors}
                    errorClassName={classes.error}
                />
            </label>
        );
    }

    private get labelID(): string {
        return this.state.id + "-label";
    }

    private get errorID(): string {
        return this.state.id + "-errors";
    }
}
