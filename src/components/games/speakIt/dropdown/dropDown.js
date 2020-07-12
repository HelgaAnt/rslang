import React, { Component } from 'react';
import { Button } from '../../../shared/button';
import { DropdownList } from './dropdownList';
import './dropdown.scss';

export class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropLevelOpen: false,
            isDropPageOpen: false,
            numberLevel: this.props.level,
            numberPage: this.props.page,
        };
    }

    chooseNumberLevels = (number) => {
        this.setState({ numberLevel: number });
    }

    chooseNumberPages = (number) => {
        this.setState({ numberPage: number });
    }

    handleClickDropdownLevels = () => {
        this.setState((prev) => ({
            isDropLevelOpen: !prev.isDropLevelOpen,
        }));
    }

    handleClickDropdownPages = () => {
        this.setState((prev) => ({
            isDropPageOpen: !prev.isDropPageOpen,
        }));
    }

    handleButtonSelect = () => {
        const {
            selectLevel,
        } = this.props;
        const {
            numberLevel,
            numberPage,
        } = this.state;
        selectLevel(numberLevel, numberPage);
    }

    render() {
        const {
            isDropLevelOpen,
            numberLevel,
            numberPage,
            isDropPageOpen,
        } = this.state;
        return (
            <div className="dropdown__options_container">
                <div className="dropdown__controls-agregator">
                    <div className={`dropdown ${isDropLevelOpen ? 'open' : ''}`}>
                        Level:
                        <Button className="mainmenubtn button" title={`${numberLevel}`} onClick={this.handleClickDropdownLevels} />
                        {isDropLevelOpen ? <DropdownList chooseNumber={this.chooseNumberLevels} closeDropdown={this.handleClickDropdownLevels} totalNumber="6" /> : null}
                    </div>
                    <div className={`dropdown ${isDropPageOpen ? 'open' : ''}`}>
                        Page:
                        <Button className="mainmenubtn button" title={`${numberPage}`} onClick={this.handleClickDropdownPages} />
                        {isDropPageOpen ? <DropdownList chooseNumber={this.chooseNumberPages} closeDropdown={this.handleClickDropdownPages} totalNumber="60" /> : null}
                    </div>
                </div>
                <Button className="button select-level" title="Select" onClick={this.handleButtonSelect} />
            </div>
        );
    }
}
