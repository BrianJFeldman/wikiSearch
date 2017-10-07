# System1 Wikipedia Frontend Challenge

## Reference Links

<https://en.wikipedia.org/w/api.php?action=help><br>
<https://en.wikipedia.org/w/api.php?action=help&modules=query>

## Prompt

We want you to make a search bar for Wikipedia similar to Google's homepage.

Given Wikipedia's web API docs linked above, please create a frontend application that completes the task specified below. This is open-book/open-internet challenge so feel free to use outside resources. If you have any questions about the requirements, please feel free to ask.

## Task

- Application should start off with a blank searchbar. **See step1.png**
- Search for categories as the user types. (Using the `gacprefix` parameter specified in the docs linked above). **See step2.png**

  - Search results should be updated as the user types.
  - Relevant API endpoint: <https://en.wikipedia.org/w/api.php?action=query&generator=allcategories&gacprefix=Sample=info>

- Show the members of the category (aka more specific results) after selecting a category from the initial search. **See step3.png**

  - Relevant API endpoint: <https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bcategorymembers>
  - Clicking on a member of the category should redirect user to the Wikipedia page for that member.

- Style the app as closely as possible to the provided screenshots.

  - We want to see well-written CSS. Feel free to add details that help highlight your skills. (Pre and post processors are ok, but please include source).
  - Make sure your app looks great on small screens.

## Expected Application Flow

1. User enters text into a search bar and then they see results for general categories.<br>
  **Example:** If user types in "China", they should see categories like "China" and "China's Got Talent".
2. User clicks on a general category which triggers a new call to Wikipedia for more specific results.<br>
  **Example:** User clicks on "China's Got Talent" which yields more specific results: like "China's Got Talent (series 1)".
3. User clicks on the more specific result.<br>
  **Example:** "China's Got Talent (series 1)" and they are redirected to the Wikipedia page for "China's Got Talent (series 1)".

## Browser Compatibility

Your application should work well on evergreen browsers: Edge, Chrome, Firefox (don't worry about Internet Explorer).

## Extra points for:

- Using Python/Flask as a web server for your app.
- Adding transition animations.
- Not using Bootstrap CSS
