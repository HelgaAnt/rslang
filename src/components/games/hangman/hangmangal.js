import React, { Component } from 'react';
import './hangman.scss';
import gal0 from './hangmanimg/gal0.png';
import gal1 from './hangmanimg/gal1.png';
import gal2 from './hangmanimg/gal2.png';
import gal3 from './hangmanimg/gal3.png';
import gal4 from './hangmanimg/gal4.png';
import gal5 from './hangmanimg/gal5.png';
import gal6 from './hangmanimg/gal6.png';

export class Gallows extends Component {
    render() {
        return (
            <div className="gallows">
                <layer id="pic0" z-index="0" className="gallows-visible">
                    <img style={{ width: 400, height: 500 }} src={gal0} alt="Gallows" />
                </layer>
                <layer id="pic1" z-index="1" className="gallows-hidden">
                    <img style={{ width: 400, height: 500 }} src={gal1} alt="Gallows" />
                </layer>
                <layer id="pic2" z-index="2" className="gallows-hidden">
                    <img style={{ width: 400, height: 500 }} src={gal2} alt="Gallows" />
                </layer>
                <layer id="pic3" z-index="3" className="gallows-hidden">
                    <img style={{ width: 400, height: 500 }} src={gal3} alt="Gallows" />
                </layer>
                <layer id="pic4" z-index="4" className="gallows-hidden">
                    <img style={{ width: 400, height: 500 }} src={gal4} alt="Gallows" />
                </layer>
                <layer id="pic5" z-index="5" className="gallows-hidden">
                    <img style={{ width: 400, height: 500 }} src={gal5} alt="Gallows" />
                </layer>
                <layer id="pic6" z-index="6" className="gallows-hidden">
                    <img style={{ width: 400, height: 500 }} src={gal6} alt="Gallows" />
                </layer>
            </div>
        );
    }
}
