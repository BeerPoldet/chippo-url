function postChippo(chippoPayload) {
  return fetch('/chippo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chippoPayload),
  }).then(response => response.json().then(json => ({ ok: response.ok, json })))
}

class ChippoAPI extends React.Component {
  state = { error: '' }

  makeChippo = chippoPayload => {
    postChippo(chippoPayload).then(response => {
      if (response.ok) {
        const { url, alias } = response.json
        window.location.assign(`p?url=${url}&alias=${alias}`)
      } else {
        this.setState({ error: response.json.error })
      }
    })
  }

  render() {
    return this.props.children({
      makeChippo: this.makeChippo,
      error: this.state.error,
    })
  }
}

class ChippoForm extends React.Component {
  state = { url: '', alias: '' }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    // e.preventDefault()
    // const { onSubmit } = this.props
    // if (onSubmit) onSubmit(this.state)
  }

  render() {
    const { url, alias } = this.state
    return (
      // <form onSubmit={this.handleSubmit}>
      <form onSubmit={this.handleSubmit} action='/chippo' method="POST">
        {this.props.error && <label>{this.props.error}</label>}
        <label>Put url below:</label>
        <input
          value={url}
          name="url"
          type="text"
          onChange={this.handleChange}
        />
        <button type="submit">Chippo!</button>
        <input
          value={alias}
          name="alias"
          type="text"
          onChange={this.handleChange}
        />
      </form>
    )
  }
}

function IndexApp() {
  return (
    <ChippoAPI>
      {({ makeChippo, error }) => (
        <ChippoForm onSubmit={makeChippo} error={error} />
      )}
    </ChippoAPI>
  )
}
