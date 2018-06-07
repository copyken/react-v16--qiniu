import React from 'react';
import QiniuUpload from './QiniuUpload';

export const Demo = function(props) {
	const maxSize, accept, submitted, token;

	const handleUpload = (val) => {

	}

	return (
		<QiniuUpload
            maxSize={maxSize}		// 文件大小限制
            handleUpload={val => handleUpload(val)}		// 上传成功返回处理response
            accept={accept}		// 接收文件格式
            submitted={submitted}		// 提交后的状态
            token={token}				// 获取的token
        />
	);
}