"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
// console.log("storylist is", storyList);
const $newStoryAuthor = $('#new-story-author');
const $newStoryTitle = $('#new-story-title');
const $newStoryUrl = $('#new-story-url');
const $newStorySubmit = $('#new-story-submit');
const $favoriteStories = $("#favorite-stories-list");

// console.log($newStorySubmit);



/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <i class="bi bi-heart"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  // console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Get and show new story data and display it on the website. */


async function getAndShowNewStory(evt) {

  console.log('getAndShowNewStory');

  // get the form data
  evt.preventDefault();

  const newStoryInfo = {
    author: $newStoryAuthor.val(),
    title: $newStoryTitle.val(),
    url: $newStoryUrl.val(),
  };

  // call addStory
  await storyList.addStory(currentUser, newStoryInfo);

  // display the story
  //FIXME:  generateStoryMarkup and prepend to allStoriesList
  putStoriesOnPage();

}
// console.log('before form submit');
$newStoryForm.on('submit', getAndShowNewStory);

// ~~~~~~~~~~~~~favorite/unfavorite functions~~~~~~~~

async function getAndShowNewFavoriteStory(evt) {

  console.log('getAndShowNewFavoriteStory');

  // call favoriteStory
  // TODO: get the story
  console.log("event target", evt.target);
  let targetId = evt.target.parentElement.id;
  let favoriteStory;

  for (let story of storyList.stories) {
    if (story.storyId === targetId) {
      favoriteStory = story;
      break;
    }
  }

  await currentUser.favoriteStory(favoriteStory);
  // $favoriteStories;
  console.log(currentUser.favorites);

  // display the story
  $favoriteStories.append(generateStoryMarkup(favoriteStory));


}

$allStoriesList.on('click', '.bi-heart', getAndShowNewFavoriteStory);

async function removeFavoriteStory(evt) {
  console.log("removeFavoriteStory");
  const targetId = evt.target.parentElement.id;
  let storyToDelete;

  for (let story of currentUser.favorites) {
    if (story.storyId === targetId) {
      storyToDelete = story;
      break;
    }
  }

  await currentUser.unfavoriteStory(storyToDelete);
  console.log("removeFavoriteStory-end of function");
}

$favoriteStories.on('click','.bi-heart',removeFavoriteStory)

function displayFavoriteStories(evt) {

  console.log('displayFavorites');

  for (let favoriteStory of currentUser.favorites) {
    const $newfavoriteStory = generateStoryMarkup(favoriteStory);
    $favoriteStories.append($newfavoriteStory);
  }

  hidePageComponents();
  $favoriteStories.show();

}
console.log($navFavorites);
$navFavorites.on('click', displayFavoriteStories)





