<Button commandfor="delete-project" command="show-modal">
  Delete project
</Button>

<Dialog id="delete-project" aria-labelledby="delete-project-title">
  <h2 id="delete-project-title">Delete this project?</h2>
  <p>This cannot be undone.</p>

  <form method="dialog">
    <Button type="submit" value="cancel" autofocus>Cancel</Button>
    <Button type="submit" value="delete">Delete project</Button>
  </form>
</Dialog>
