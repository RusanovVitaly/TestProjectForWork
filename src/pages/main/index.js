import React from 'react';
import {Form,Button, Row, Col, AutoComplete} from 'antd';
import Fade from 'react-reveal/Fade';
import axios from 'axios';
import { NavLink } from 'react-router-dom'

const searchUrl = "http://ws.audioscrobbler.com";


const apiKey = "372334a4d65c65cc8137d922f890ceeb";

class Main extends React.Component {


    state = {
        search: "",
        artists: [],
        dataSource: []
    };

    getArtists(values){
        axios.post( `${searchUrl}/2.0/?method=artist.search&artist=${values.search_field}&api_key=${apiKey}&format=json`, {}, {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*",
                "X-Requested-With": "XMLHttpRequest",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
            }
        })
            .then(response => {
                this.setState({artists: response.data.results.artistmatches.artist});
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.getArtists(values);
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (

            <div className={'main-page'}>
                <div className="banner">
                    <div className="back"/>
                    <div className="content">
                        <Fade right>
                            <h1>
                                Найдите любимого исполнителя
                            </h1>
                        </Fade>
                        <div className="search">
                            <Fade left>
                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                    <Form.Item>
                                        {getFieldDecorator('search_field', {
                                            rules: [{
                                                required: true,
                                                message: 'Пожалуйста, введите искомого исполнителя!'
                                            }],
                                        })(
                                        <AutoComplete icon="search"
                                                      placeholder="Введите искомого исполнителя"
                                                      dataSource={this.state.dataSource} onSelect={(val) => {
                                            this.setState({searchQuery: val}, _ => {
                                                console.log(this.state.searchQuery)
                                            })
                                        }} onChange={(val) => {
                                            this.handleAutoComplete(val)
                                        }}/>,
                                            )}
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" onClick={(e) => {
                                            this.handleSubmit(e)
                                        }}>
                                            <a href="#musicans">Искать</a>
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Fade>
                        </div>
                    </div>
                </div>
                <div className="musicans" id='musicans'>
                    <h2>
                        Исполнители
                    </h2>
                    <Fade top>
                        <Row gutter={16}>
                            {this.state.artists.length !== 0 ? this.state.artists.map((res, key) => {
                                return (
                                    <Col span={6} key={key}>
                                        <NavLink to = {`/artist/${res.name}`}>
                                            <div className="card">
                                                <div className="card-content">
                                                    <div className="user-photo">
                                                        <div className="user-photo-wrapper">
                                                            <img
                                                                src="http://markimarta.ru/wp-content/uploads/2017/11/word-image-1.jpeg"
                                                                alt="user photo"/>
                                                        </div>
                                                    </div>
                                                    <h3>{res.name}</h3>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </Col>
                                )
                            }) : "Ничего не найдено!Проверьте введёное значение!"}
                        </Row>
                    </Fade>
                </div>
            </div>
        );
    }


    handleAutoComplete(val) {
        {/*Решил сделать автокомплит на поиске, что бы хоть какая то фишка была, а то уныло это всё....*/}
        if (val) {
            axios.post(`${searchUrl}/2.0/?method=artist.search&artist=${val}&api_key=${apiKey}&format=json`, {}, {
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "X-Requested-With": "XMLHttpRequest",
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                }
            })
                .then(response => {
                    const dataSource = response.data.results.artistmatches.artist.map(item => item.name);
                    this.setState({dataSource: dataSource});
                })
                .catch(_ => {
                    this.setState({dataSource: []});
                    console.log('error')
                });
        }
    }
}

export default Form.create({name: 'search-form'})(Main);