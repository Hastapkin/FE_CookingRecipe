import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  isAuthenticated,
  getProfile,
  uploadProfilePicture,
  updateProfile,
  getUserSession,
  saveUserSession
} from '../services/auth'

function ProfileSettings() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentProfilePicture, setCurrentProfilePicture] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile()
        setName(profile.name || '')
        setEmail(profile.email || '')
        setCurrentProfilePicture(profile.profilePicture || null)
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }

    loadProfile()
  }, [navigate])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file')
      return
    }

    try {
      setLoading(true)
      const response = await uploadProfilePicture(selectedFile)

      if (response.success) {
        setCurrentProfilePicture(response.data.imageUrl)
        setPreviewUrl(null)
        setSelectedFile(null)

        const session = getUserSession()
        if (session) {
          const updatedUser = { ...session.user, profilePicture: response.data.imageUrl }
          saveUserSession(updatedUser, session.token)
          window.dispatchEvent(new Event('authStateChanged'))
        }

        alert('Profile picture updated successfully!')
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePreview = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Name and email are required.')
      return
    }

    try {
      setSavingProfile(true)
      const updated = await updateProfile(name.trim(), email.trim())
      const session = getUserSession()
      if (session) {
        saveUserSession({ ...session.user, ...updated }, session.token)
      }
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert(error instanceof Error ? error.message : 'Failed to update profile. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Update your name, email, and profile picture</p>
        </div>
      </section>

      <section className="profile-picture-section">
        <div className="container">
          <div className="profile-picture-container">
            <div className="upload-section">
              <h3>Profile Details</h3>
              <div className="form-group">
                <label htmlFor="profileName">Full Name</label>
                <input
                  id="profileName"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profileEmail">Email</label>
                <input
                  id="profileEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="current-picture-section">
              <h3>Current Profile Picture</h3>
              {currentProfilePicture ? (
                <div className="profile-picture-preview">
                  <img src={currentProfilePicture} alt="Current profile" />
                </div>
              ) : (
                <div className="profile-picture-placeholder">
                  <i className="fas fa-user"></i>
                  <p>No profile picture set</p>
                </div>
              )}
            </div>

            <div className="upload-section">
              <h3>Profile Picture</h3>
              <div className="form-group">
                <label htmlFor="profilePicture" className="file-upload-label">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  <div className="file-upload-button">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>{selectedFile ? selectedFile.name : 'Choose Image File'}</span>
                  </div>
                </label>
                <p className="form-help-text">
                  Supported formats: JPG, PNG, GIF. Maximum size: 5MB
                </p>
              </div>

              {previewUrl && (
                <div className="preview-section">
                  <h4>Preview</h4>
                  <div className="profile-picture-preview">
                    <img src={previewUrl} alt="Preview" />
                    <button
                      type="button"
                      className="remove-preview-btn"
                      onClick={handleRemovePreview}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload"></i>
                      Upload Picture
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(-1)}
                  disabled={loading || savingProfile}
                >
                  <i className="fas fa-arrow-left"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProfileSettings
