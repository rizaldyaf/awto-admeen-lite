import { Html5QrcodeScanner } from "html5-qrcode";
import React from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

class Html5QrcodePlugin extends React.Component {

    componentWillUnmount() {
        // TODO(mebjas): See if there is a better way to handle
        //  promise in `componentWillUnmount`.
        if (this.scanner) {
            this.scanner.clear().catch(error => {
                console.error("Failed to clear scanner ", error);
            });
        }
        
    }

    componentDidMount() {
        // Suceess callback is required.
        let config = {
            fps:this.props.fps,
            qrbox:this.props.qrbox,
            aspectRatio:this.props.aspectRatio,
            disableFlip:this.props.disableFlip || false
        }
        if (!this.scanner) {
            this.scanner = new Html5QrcodeScanner(qrcodeRegionId, config, false)

            if (!(this.props.qrCodeSuccessCallback )) {
                throw Error("qrCodeSuccessCallback is required callback.");
            }
            this.scanner.render(
                this.props.qrCodeSuccessCallback,
                this.props.qrCodeErrorCallback);
        }
        
    }

    render() {
        return <div id={qrcodeRegionId} />;
    }
};

export default Html5QrcodePlugin;