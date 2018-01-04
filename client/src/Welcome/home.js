import React, {Component} from 'react';
import './home.css';

class Home extends Component{
    render(){
        return(
            <div className='container'>
                {/*begin of carousel*/}
                <div id="myCarousel" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="item active">
                            <img className="d-block w-100 img-responsive" src="http://lorempixel.com/1500/600/abstract/1" alt="First slide"/>
                        </div>
                        <div className="item">
                            <img className="d-block w-100 img-responsive" src="http://lorempixel.com/1500/600/abstract/2" alt="Second slide"/>
                        </div>
                        <div className="item">
                            <img className="d-block w-100 img-responsive" src="http://lorempixel.com/1500/600/abstract/3" alt="Third slide"/>
                        </div>
                    </div>
                    <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
                {/*end of carousel*/}
            </div>

        )
    }
}

export default Home;
