import React from 'react';
import Qiniu from 'react-qiniu';

import { Button, Progress, message } from 'antd';
import { GLOBAL_URL } from '../../utils/utils'

export default class QiniuUpload extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state =  {
    //         files: [],
    //         token: 'wK6jzEPAdkfd1We61RWbb99Sq8pQkXQPRMh6jB7_',
    //         uploadKey: 'wxcK5T4R8ek-SyzwqfMq5Bj6UpyPu9odY8KE3FJU', // Optional
    //         // prefix: 'YOUR_QINIU_KEY_PREFIX' // Optional
    //     };
    // };

    state =  {
        files: [],
        token: this.props.token,
        // uploadKey: 'wxcK5T4R8ek-SyzwqfMq5Bj6UpyPu9odY8KE3FJU', // Optional
        // prefix: 'YOUR_QINIU_KEY_PREFIX' // Optional
        percent: 0,
        showprogress: false,
        uploadName: '',
        uploadUrl: '',
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.submitted){
            this.setState({
                percent: 0,
                showprogress: false,
            });
        }
    }

    handleExceedSize = () => {
        message.error(`文件大小不能超过 ${this.props.maxSize} Mb`);
    }

    onUpload = (files) => {
        // set onprogress function before uploading
        files.map((f) => {
            f.onprogress = (e) => {
                if(e.percent > 0 && e.percent < 100){
                    this.setState({
                        percent: parseInt(e.percent),
                        showprogress: true,
                    });
                }
                if(e.currentTarget.status && e.currentTarget.status === 200){
                    const data = JSON.parse(e.currentTarget.response);
                    this.setState({
                        uploadName: data['x:filename'],
                        uploadUrl: GLOBAL_URL + data.key,
                        percent: parseInt(e.percent),
                        showprogress: true,
                    })
                    this.props.handleUpload(data.key);
                    message.success(`文件 ${data['x:filename']} 上传成功`);
                }
            };
        });
    };

    onDrops = (files) => {
        this.setState({
            files: files,
            percent: 0,
            showprogress: false,
        });
        // files is a FileList(https://developer.mozilla.org/en/docs/Web/API/FileList) Object
        // and with each file, we attached two functions to handle upload progress and result
        // file.request => return super-agent uploading file request
        // file.uploadPromise => return a Promise to handle uploading status(what you can do when upload failed)
        // `react-qiniu` using bluebird, check bluebird API https://github.com/petkaantonov/bluebird/blob/master/API.md
        // see more example in example/app.js

        // console.log('Received files: ', files);
    };

    render() {
        const { percent, showprogress, uploadName } = this.state;

        return (
          <div>
            <Qiniu accept={this.props.accept} onDrop={this.onDrops} style={{ width: 82 }} maxSize={this.props.maxSize} size={120} token={this.state.token}  onUpload={this.onUpload} handleExceedSize={this.handleExceedSize}>
              {/* <div>点击上传</div> */}
              <Button type="default" icon="upload" >上传</Button>
            </Qiniu>
            {showprogress &&
                <div>
                    <span>{uploadName}</span>
                    <Progress percent={percent} size="small" />
                </div>
            }
            {/* <Progress percent={percent} size="small" /> */}
          </div>
      );
    }
};