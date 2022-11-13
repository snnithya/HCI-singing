const singButton = document.getElementById("singButton");

function changeText(text) {
  document.getElementById("mySong").innerHTML = text;
  singButton.style.visibility = 'visible';
};



let products = {
    data: [
      {
        songName: "One Nation Under a Groove",
        category: "Funk",
      },
      {
        songName: "My Favorite Things",
        category: "Jazz",
      },
      {
        songName: "Born to Be Wild",
        category: "Rock",
      },
      {
        songName: "Jungle Boogie",
        category: "Funk",
      },
      {
        songName: "She Will be Loved",
        category: "Pop",
      },
      {
        songName: "The Scientist",
        category: "Pop",
      },
      {
        songName: "Take Five",
        category: "Jazz",
      },
      {
        songName: "God Bless The Child",
        category: "Jazz",
      },

      {
        songName: "Halo",
        category: "Pop",
      },

      {
        songName: "Dangerous Woman",
        category: "Pop",
      },
      {
        songName: "The Boys Are Back in Town",
        category: "Rock",
      },
      {
        songName: "Rolling in the Deep",
        category: "Pop",
      }
    ],
  };
  for (let i of products.data) {
    //Create Card
    let card = document.createElement("div");
    //Card should have category and should stay hidden initially
    card.classList.add("card", i.category, "hide");

    //container
    let container = document.createElement("div");
    container.classList.add("container");
    //product name
    let name = document.createElement("h5");
    name.classList.add("product-name");
    name.innerText = i.songName;
    container.appendChild(name);
   
    card.appendChild(container);
    card.style="cursor: pointer"
    card.onclick = function () {
        document.getElementById("mySong").innerHTML = i.songName;
        singButton.style.visibility = 'visible';
    };
    document.getElementById("products").appendChild(card);
  }
  //parameter passed from button (Parameter same as category)
  function filterProduct(value) {
    //Button class code
    let buttons = document.querySelectorAll(".button-value");
    buttons.forEach((button) => {
      //check if value equals innerText
      if (value.toUpperCase() == button.innerText.toUpperCase()) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
    //select all cards
    let elements = document.querySelectorAll(".card");
    //loop through all cards
    elements.forEach((element) => {
      //display all cards on 'all' button click
      if (value == "all") {
        element.classList.remove("hide");
      } else {
        //Check if element contains category class
        if (element.classList.contains(value)) {
          //display element based on category
          element.classList.remove("hide");
        } else {
          //hide other elements
          element.classList.add("hide");
        }
      }
    });
  }
  //Search button click
  document.getElementById("search").addEventListener("click", () => {
    //initializations
    let searchInput = document.getElementById("search-input").value;
    let elements = document.querySelectorAll(".product-name");
    let cards = document.querySelectorAll(".card");
    //loop through all elements
    elements.forEach((element, index) => {
      //check if text includes the search value
      if (element.innerText.toUpperCase().includes(searchInput.toUpperCase())) {
        //display matching card
        cards[index].classList.remove("hide");
      } else {
        //hide others
        cards[index].classList.add("hide");
      }
    });
  });
  //Initially display all products
  window.onload = () => {
    filterProduct("all");
  };