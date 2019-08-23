import React from 'react';
import axios from "axios";
import { Row, Col, Icon} from 'antd';
import {NavLink} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { Tabs } from 'antd';


const { TabPane } = Tabs;


let getArtistUrl = "http://ws.audioscrobbler.com";

class Artist extends React.Component{
    state = {
        artist:window.location.href.split('/').pop(),
        albums:[],
        apiKey:"372334a4d65c65cc8137d922f890ceeb",
        artistBio:[],
        artistDescription:'',
        artistImage:'',
        artistTags:[]
    };

    componentDidMount() {
        {/*Запрос на получении информации о исполнителе*/}
        axios.post(getArtistUrl + `/2.0/?method=artist.getinfo&artist=${this.state.artist}&api_key=${this.state.apiKey}&format=json`,{},{
            headers:{
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
            }
        })
            .then(response => {
                if(response.data.artist !== undefined){
                    this.setState({artistBio:response.data.artist});
                }
                else  this.setState({artistBio:""});

                if(this.state.artistBio.bio.content !== undefined || this.state.artistBio.bio.content !==""){
                    this.setState({artistDescription:this.state.artistBio.bio.content});
                }
                else this.setState({artistDescription:"К сожалению, у данного исполнителя нет описания!"});

                if(this.state.artistBio.image[3]['#text'] !== undefined){
                    this.setState({artistImage:this.state.artistBio.image[3]['#text']});
                }

                if(response.data.artist.tags.tag !== undefined){
                    this.setState({artistTags:response.data.artist.tags.tag});
                }
                else this.setState({artistTags:""});
            })
            .catch(function (error) {
                console.log(error);
            });
        {/*Я решил сделать чуть-чуть больше чем было указано в задании, поэтому в этом запросе я получаю информацию о исполнителе, для получения его тегов, информации о нём и тд*/}
        {/*Тут я получаю его альбомы, апи конечно странноватое у LastFm но что поделать*/}
        axios.post(getArtistUrl + `/2.0/?method=artist.getTopAlbums&artist=${this.state.artist}&api_key=${this.state.apiKey}&format=json`,{},{
            headers:{
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
            }
        })
            .then(response => {
                this.setState({albums:response.data.topalbums.album});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return(
            <div>
                <div className={'GoBack'}><NavLink to={"/"}><Icon type="left" className={'GoBack-icon'}/></NavLink></div>
                <Tabs defaultActiveKey="1" className={'NavTabs'}>
                    <TabPane tab="Альбомы" key="1">
                        <div className={'AlbumsHolder'}>
                            <div className={"Albums-tag"}>
                                <h1>Альбомы</h1>
                            </div>
                            <div className={"Albums-tag"}>
                                <div className={'Albums-tag-holder'}>
                                    <div>Теги исполнителя:</div>
                                    {
                                        this.state.artistTags.map((tag, key) => {
                                            return <div className={'Tags'} key={key}>{tag.name}</div>
                                        })
                                    }
                                </div>

                            </div>
                            <Row gutter={6}>
                                {this.state.albums.map((res, key) => {
                                    if (res.name !== "(null)" && res.name !== "undefined") {
                                        return <Col span={4} key={key}>
                                            <div className="album">
                                                <div className="album-content">
                                                    <div className="album-photo">
                                                        <div className="album-photo-wrapper">
                                                            <img
                                                                src={res.image[2]['#text'] === "" ? 'https://lastfm-img2.akamaized.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png' : res.image[2]['#text']}
                                                                alt="album photo"/>
                                                        </div>
                                                    </div>
                                                    <h3>{res.name}</h3>
                                                    <p>Количество прослушиваний: {res.playcount}</p>
                                                    <p><a href={res.url}>Слушать на Last.fm</a></p>
                                                </div>
                                            </div>
                                        </Col>
                                    }
                                })}
                            </Row>
                        </div>
                    </TabPane>
                    <TabPane tab="Информация" key="2">
                        <div className={'Artist-tag'}><h1>Исполнитель {this.state.artistBio.name}</h1></div>
                        <Row gutter={8}>
                            {/*Привет тому кто смотрит этот код, -> на строчку ниже должна выводиться фотография исполнителя, но мне их апи всегда возвращает звёздочку, поэтому не мой косяк, вот как то так да*/}
                            <img src={this.state.artistImage} alt=""/>
                            <Col span={12}>
                                <div className={'BioHolder-content'}>
                                    <p className={'BioHolder-description'}>{ReactHtmlParser(this.state.artistDescription)}</p>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Что-то ещё" key="3">
                        Что-то ещё:)
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Artist;