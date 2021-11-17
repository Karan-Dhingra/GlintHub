import React from "react";
import ReactModal from "react-modal";
import { doc, updateDoc, deleteDoc } from "@firebase/firestore";
import { connect } from "react-redux";
import { updateProject, deleteProject } from "../actions";
import { Firestore, deleteDocProject, updateDocProject, storageProject } from "../../firebase";
import { uploadBytes, getDownloadURL } from "@firebase/storage";

class Modal extends React.Component {
    state = {
        user: this.props.user,
        title: this.props.modalApp.title,
        image: this.props.modalApp.image,
        description: this.props.modalApp.description,
        githubURL: this.props.modalApp.githubURL,
        coreTech: this.props.modalApp.coreTech,
        techUsed: this.props.modalApp.techUsed,
        modalApp: this.props.modalApp,
        adminRole: this.props.user.role == "admin",
    };


    handleChange = (event) => {
        this.setState(() => ({ [event.target.name]: event.target.value }))
    }
    
  uploadImage = (event) => {
    // Change Image value at state so that it can go through isFormValid
    this.setState(() => ({ [event.target.name]: event.target.value }));
    // console.log("pressed");
    var image = document.getElementById("image"); // Visibility Hidden at componentDidMount
    var imageLabel = document.getElementById("imageLabel");

    if (image.value !== "") {
      document.getElementById("labelCover").style.visibility = "hidden";
      var imageSplit = image.value.split("\\");
      var imageName = imageSplit[imageSplit.length - 1];
      imageLabel.textContent = imageName;
      imageLabel.style.display = "block";
      imageLabel.classList.add("imageLabel"); // Add border, padding etc.
      image.setAttribute("disabled", "disabled");
    }
  };


  removeImage = (event) => {
    var image = document.getElementById("image");
    var imageLabel = document.getElementById("imageLabel");

    // console.log(event.nativeEvent.offsetX, imageLabel.offsetWidth - 17);
    if (event.nativeEvent.offsetX > imageLabel.offsetWidth - 17) {
      image.value = "";
      this.setState(() => ({ image: "" }));
      document.getElementById("labelCover").style.visibility = "visible";
      imageLabel.style.display = "none";
      image.removeAttribute("disabled");
    }
  };



    handleUpdateModal = async () => {
        if(!this.state.adminRole){const imageFile = document.getElementById("image").files[0];
        let { title, image, description, githubURL, coreTech, techUsed, modalApp } = this.state;


            uploadBytes(storageProject(modalApp.id), imageFile).then((snapshot) => {
                // console.log("Uploaded a blob or file!", snapshot);
                getDownloadURL(storageProject(modalApp.id))
                  .then(
                    async (url) => {
                      let projectData = {
                            title,
                            image: url,
                            description,
                            githubURL,
                            coreTech,
                            techUsed,
                      };

                      // console.log(url);
                      await updateDocProject(modalApp.id, projectData)
            this.props.updateProject(modalApp, projectData)
            this.props.closeModal();

                    })
                  .catch((error) => {
                    // console.log(error)
                  });
              });
            } else {
                let projectData = {
                    projectStatus: "isPublished"
              };
            await updateDocProject(this.state.modalApp.id, projectData)
            this.props.updateProject(this.state.modalApp, projectData)
            this.props.closeModal();
            
            }
    };


    handleDeleteModal = async () => {
        let { modalApp } = this.state;
        console.log(modalApp)
        await deleteDocProject(modalApp.id);
        this.props.deleteProject(modalApp)
        this.props.closeModal();
    };


    render() {
        let { title, description, githubURL, image, techUsed, adminRole } = this.state;
        return (
            <ReactModal
                isOpen={this.props.modalIsOpen}
                onRequestClose={this.props.closeModal}
                ariaHideApp={false}
            >
                <div>
                    <div id="glinthubDashboardAddApp">
                        <div className="addAppForm">
                            <div className="addAppFormFields title">
                                <input className="addAppFormField" maxLength="15" type="text" name="title" value={title} disabled={adminRole} placeholder="Project Title" onChange={this.handleChange} />
                            </div>
                            <div className="addAppFormFields image position-relative">
                                <div id="labelCover">
                                    <button className="labelCoverBtn">Choose Project Image</button>
                                    <span className="labelCover">No file chosen</span>
                                </div>
                                <input disabled={adminRole} className="addAppFormField" type="file" id="image" name="image" onChange={this.uploadImage} />
                                <label id="imageLabel" onClick={this.removeImage}>No file chosen</label>
                            </div>
                            <div className="addAppFormFields description">
                                <textarea className="addAppFormField" type="text" placeholder="Project Description" disabled={adminRole} name="description" value={description} onChange={this.handleChange}></textarea>
                            </div>
                            <div className="addAppFormFields githubURL">
                                <input className="addAppFormField" type="text" disabled={adminRole} placeholder="GitHub URL" name="githubURL" value={githubURL} onChange={this.handleChange} />
                            </div>
                            <div className="addAppFormFields coreTech">
                                <label className="labels">Web
                                    <input type="radio" disabled={adminRole} name="coreTech" value="Web" onChange={this.handleChange} />
                                    <span className="labelCheck"></span>
                                </label>
                                <label className="labels">Android/IOS
                                    <input type="radio" disabled={adminRole} name="coreTech" value="Android/IOS" onChange={this.handleChange} />
                                    <span className="labelCheck"></span>
                                </label>
                                <label className="labels justify-self-end">Other
                                    <input type="radio" disabled={adminRole} name="coreTech" value="Other" onChange={this.handleChange} />
                                    <span className="labelCheck"></span>
                                </label>
                            </div>
                            <div className="addAppFormFields techUsed">
                                <input className="addAppFormField" type="text" placeholder="Technologies used" disabled={adminRole} name="techUsed" value={techUsed} onChange={this.handleChange} />
                            </div>
                        </div>

                        { adminRole ? <button type="button" name="addApp" className="btn btn-success addProject" onClick={this.handleUpdateModal}>Publish App</button> : <button type="button" name="addApp" className="btn btn-success addProject" onClick={this.handleUpdateModal}>Update App</button>}
                        <button type="button" name="draftApp" className="btn btn-success addProject" onClick={this.handleDeleteModal}>Delete App</button>
                        <button className="btn btn-success addProject mr-0" onClick={this.props.closeModal}>Close</button>
                    </div>
                    <div>
                    </div>
                </div>
            </ReactModal>
        );
    }
}

export default connect(null, { updateProject, deleteProject })(Modal)