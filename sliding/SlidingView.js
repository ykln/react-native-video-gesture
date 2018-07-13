import React, {Component} from "react";
import {PanResponder, View} from 'react-native';

export default class SlidingView extends Component {
    static defaultProps = {
        direction: 0,

    }

    constructor(props) {
        super(props)
        this.state = {
            direction: props.direction,
            distance: 0,
        }
        //手指id
        this.eventId = null;
        //0初始值  大于0 水平  小于0 垂直
        this.direction = props.direction;
        //移动距离 右上为正   坐下为负
        this.distance = 0;
    }

    setDirection(d) {
        this.direction = d;
    }


    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
        });
    }

    _handlePanResponderGrant(e: Object, gestureState: Object) {
        if (!this.eventId) {
            this.eventId = gestureState.stateID;
            this.direction = 0;
            this.distance = 0;
            if (this.props.onStart) {
                this.props.onStart({x: gestureState.x0, y: gestureState.y0});
            }
        }
    }

    _handlePanResponderMove(e: Object, gestureState: Object) {
        if (this.eventId == gestureState.stateID) {
            if (this.direction == 0) { //获取方向
                if (Math.abs(gestureState.dx) < Math.abs(gestureState.dy)) {
                    this.direction = -1;
                } else if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
                    this.direction = 1;
                }
            }
            // 获取距离
            if (this.direction > 0) {
                // this.distance += distanceX;
                this.distance = gestureState.dx;
            } else if (this.direction < 0) {
                // this.distance += distanceY;
                this.distance = gestureState.dy;
            }
            if (this.direction != 0 && this.state.distance != this.distance) {
                if (this.props.onSliding) {
                    this.props.onSliding({
                        direction: this.direction,
                        distance: this.distance,
                    });
                }
            }
        }
    }

    _handlePanResponderEnd(e: Object, gestureState: Object) {
        if (this.eventId == gestureState.stateID) {
            if (this.props.onEnd) {
                this.props.onEnd({
                    direction: this.direction,
                    distance: this.distance,
                });
            }
            this.eventId = null;
            this.direction = this.props.direction;
            this.distance = 0;
        }
    }

    layout(e) {
        console.log(JSON.stringify(e))
    }

    render() {
        return (<View style={this.props.style}
                      onLayout={this.props.onLayout}{...this._panResponder.panHandlers} >
        </View>);
    }
}