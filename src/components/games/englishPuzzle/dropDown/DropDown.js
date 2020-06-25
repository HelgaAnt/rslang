import React, { Component } from 'react';
import './dropDown.scss';
import { Button } from '../../../shared/button';
import { DropdownList } from './DropDownList';

export class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropWordOpen: false,
            isDropCardsOpen: false,
            numberWords: 1,
            numberCards: 1,
        };
    }

    chooseNumberWords = (number) => {
        this.setState({ numberWords: number });
    }

    chooseNumberCards = (number) => {
        this.setState({ numberCards: number });
    }

    handleClickDropdownWords = () => {
        this.setState((prev) => ({
            isDropWordOpen: !prev.isDropWordOpen,
        }));
    }

    handleClickDropdownCards = () => {
        this.setState((prev) => ({
            isDropCardsOpen: !prev.isDropCardsOpen,
        }));
    }

    render() {
        const {
            isDropWordOpen,
            numberWords,
            numberCards,
            isDropCardsOpen,
        } = this.state;
        return (
            <div className="dropdown__options_container">
                <div className={`dropdown ${isDropWordOpen ? 'open' : ''}`}>
                    Level:
                    <Button className="mainmenubtn button" title={`${numberWords}`} onClick={this.handleClickDropdownWords} />
                    {isDropWordOpen ? <DropdownList chooseNumber={this.chooseNumberWords} closeDropdown={this.handleClickDropdownWords} /> : null}
                </div>
                <div className={`dropdown ${isDropCardsOpen ? 'open' : ''}`}>
                    Page:
                    <Button className="mainmenubtn button" title={`${numberCards}`} onClick={this.handleClickDropdownCards} />
                    {isDropCardsOpen ? <DropdownList chooseNumber={this.chooseNumberCards} closeDropdown={this.handleClickDropdownCards} /> : null}
                </div>
                <div className={`dropdown ${isDropCardsOpen ? 'open' : ''}`}>
                    Number Word:
                    <Button className="mainmenubtn button" title={`${numberCards}`} onClick={this.handleClickDropdownCards} />
                    {isDropCardsOpen ? <DropdownList chooseNumber={this.chooseNumberCards} closeDropdown={this.handleClickDropdownCards} /> : null}
                </div>
            </div>
        );
    }
}
