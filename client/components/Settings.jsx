import React from 'react'

class Settings extends React.Component {

  render () {
    return (
      <div>
        <h2>Settings</h2>
        <form>
          <p>
            Gmail Address<input type="text" />
            Gmail Password<input type="password" />
          </p>
          <button>Change</button>
        </form>
      </div>
    )
  }
}

export default Settings