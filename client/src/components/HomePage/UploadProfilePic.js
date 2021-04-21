import React, { Component } from "react";
import { connect } from "react-redux";



// import React, { Component } from 'react'
// import Spinner from './Spinner'
// import Images from './Images'
// import Buttons from './Buttons'
// import { API_URL } from './config'
 



// const UploadProfilePic = (props) => {


//   function uploadPhoto(e) {
//     console.log('The link was clicked.');
//   }

//   return (
//     <div>
//       <div className="UploadProfilePic">Upload Picture</div>
//       <button onClick={uploadPhoto}>Activate Lasers</button>
//     </div>
//   );
// };


class UploadProfilePic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };

    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      this.setState({
        image: URL.createObjectURL(img)
      });
    }
  };

  // handleSubmit = (event) => {
  //   event.preventDefault();

  //   fetch(`localhost/upload_picture`, {
  //     method: 'POST',
  //     body: formData
  //   })


  // }

  render() {
    return (
      <div>
        <div>
          <form action="/upload_picture" method="post" encType = 'multipart/form-data'>
            {/* <img src={this.state.image} /> */}
            <h1>Select Image</h1>
            <input type="file" name="profile_pic" onChange={this.onImageChange} />
            <input type="submit" value="Submit" />

          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(UploadProfilePic);
