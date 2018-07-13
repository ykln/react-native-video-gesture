import React, {Component} from "react";
import SlidingView from "./SlidingView";

export default class VideoOperationComponet extends Component {
    static defaultProps = {
        onClick: null,
        onProgress: null,
        onProgressEnd: null,
        onLeftProgress: null,
        onLeftProgressEnd: null,
        onRightProgress: null,
        onRightProgressEnd: null,
        leftControl: 150,//左边控制区域宽度
        rightControl: 150,//右边控制区域宽度
    }

    constructor(props) {
        super(props)
        this.startX = -1;
        this.width = 0;
        this.height=0;
    }


    onStart(d) {
        this.startX = d.x;
        if (this.isLeftControl() || this.isRightControl()) {
            this.refs.view.setDirection(0);
        } else {
            this.refs.view.setDirection(1);
        }
    }

    onSliding(d) {
        d.distance;
        if (d.direction > 0) {//水平
            this.props.onProgress&&this.props.onProgress(d.distance/this.width);
        } else {
            if (this.isLeftControl()) {
                this.props.onLeftProgress&&this.props.onLeftProgress(d.distance/this.height);
            } else if (this.isRightControl()) {
                this.props.onRightProgress&&this.props.onRightProgress(d.distance/this.height);
            }
        }

    }

    onEnd(d) {
        if (d.distance == 0) {
            this.props.onClick&&this.props.onClick();
            return;
        }

        if (d.direction > 0) {
            this.props.onProgressEnd&&this.props.onProgressEnd(d.distance/this.width);
        } else if (d.direction < 0) {
            if (this.isLeftControl()) {
                this.props.onLeftProgressEnd&&this.props.onLeftProgressEnd(d.distance/this.height);
            } else if (this.isRightControl()) {
                this.props.onRightProgressEnd&&this.props.onRightProgressEnd(d.distance/this.height);
            }
        }
    }

    /**
     * 是否在左控制区
     * @returns {boolean}
     */
    isLeftControl() {
        return this.startX <= this.width/2;
    }

    /**
     * 是否在右控制区
     * @returns {boolean}
     */
    isRightControl() {
        return this.startX >=this.width/2;
    }
    layout(e) {
        console.log(JSON.stringify(e))
       this.width= e.layout.width;
       this.height= e.layout.height;
    }
    render() {
        return (
            <SlidingView
                ref="view"
                style={this.props.style}
                onStart={(d) => {
                    this.onStart(d);
                }}
                onSliding={(d) => {
                    this.onSliding(d);
                }}
                onEnd={(d) => {
                    this.onEnd(d);
                }}
                onLayout={({nativeEvent: e}) =>
                    this.layout(e)
                }
            />
        );
    }
}