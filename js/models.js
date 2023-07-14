"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    return "hostname.com";
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}// newStory
   *
   * Returns the new Story instance
   */

  //https://hack-or-snooze-v3.herokuapp.com/stories
  // data along with post request
  // {
  // "token": "YOUR_TOKEN_HERE",
  // "story": {
  //   "author": "Matt Lane",
  //   "title": "The best story ever",
  //   "url": "http://google.com"
  // }
  async addStory(user, newStory) {
    // UNIMPLEMENTED: complete this function!
    // deconstruct user
    let { username, loginToken } = user;
    // deconstruct newStory
    let { title, author, url } = newStory;
    // make an API call (post request with new story)
    let newStoryInfoAndToken = {
      token: loginToken,
      story: {
        author: author,
        title: title,
        url: url
      }
    };
    let response = await axios.post(`${BASE_URL}/stories`, newStoryInfoAndToken);
    console.log('response is =>', response);
    // API will give the reponse back with data for creating a new Story instance
    // {
    //   "story": {
    //     "author": "Matt Lane",
    //     "createdAt": "017-11-09T18:38:39.409Z",
    //     "storyId": "5081e46e-3143-4c0c-bbf4-c22eb11eb3f5",
    //     "title": "The Best Story Ever",
    //     "updatedAt": "017-11-09T18:38:39.409Z",
    //     "url": "https://www.rithmschool.com/blog/do-web-developers-need-to-be-good-at-math",
    //     "username": "hueter"
    //   }
    // }
    let storyId = response.data.story.storyId;
    let createdAt = response.data.story.createdAt;

    // story: constructor({ storyId, title, author, url, username, createdAt })
    let story = new Story(storyId, title, author, url, username, createdAt); // TODO: Story object keys are undefined; might be because issue with setting or aceessing the vals

    return story;
  }
}

 //

/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    const { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    const { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      const { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}
