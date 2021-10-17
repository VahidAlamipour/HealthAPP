import React,{Component} from 'react';
import { Button } from 'reactstrap';
import connect from 'react-redux/es/connect/connect';
import RecorderService from '../services/RecorderService';

var _recorderSrvc = new RecorderService();

class AudioRecorder extends Component
{
   constructor(props)
   {
      super(props);
      this.state={
         isRecording:false
         , data:null
      };

      this.onNewRecording = this.onNewRecording.bind(this);
      this.onStartRecordButtonPress = this.onStartRecordButtonPress.bind(this);
      this.onStopRecordButtonPress = this.onStopRecordButtonPress.bind(this);
   }

   onNewRecording(evt)
   {
      this.setState({isRecording:false, data:evt.detail.recording});
   }
   
   onStartRecordButtonPress()
   {
      this.setState({isRecording:true});
      _recorderSrvc.startRecording()
      .then(()=>{
         console.log("AudioRecorder::onStartRecordButtonPress(), recording...");
      })
      .catch((err)=>{
         console.log("AudioRecorder::onStartRecordButtonPress(), ERROR:" + err);
      });
   }

   onStopRecordButtonPress()
   {
      //this.setState({isRecording:false});
      _recorderSrvc.stopRecording();
   }

   componentWillMount()
   {
      _recorderSrvc.em.addEventListener('recording',(evt)=>this.onNewRecording(evt));
   }
   
   render()
   {
      return(
         <div>
            <Button 
               onClick={this.onStartRecordButtonPress}
               disabled={this.state.isRecording}>Start Recording
            </Button>
            <Button 
               onClick={this.onStopRecordButtonPress} 
               disabled={!this.state.isRecording} >Stop Recording
            </Button>
            {
               this.state.data!==null &&
               <audio src={this.state.data.blobUrl} controls={true} />
            }
         </div>
      );
   }
}

const mapStateToProps = state=>({...state.audiorecorder});

export default connect(mapStateToProps)(AudioRecorder)