import { useState} from "react";
import "./App.css";

function App() {
  const [currentDog, setCurrentDog] = useState(null);
  const [banList, setBanList] = useState([]);
  const [seenSoFar, setSeenSoFar] = useState([]);
  const [discoverBtnClicked, setDiscoverBtnClicked] = useState(false);

  const fetchRandomDog = async () => {
    try {
      const response = await fetch(
        "https://api.thedogapi.com/v1/images/search?limit=10&has_breeds=1",
        {
          headers: {
            "x-api-key":
              "live_0zvxRYPbgnXEsR3C6en9BwEaORMFpofOjVxyMGq6Wn5AGPxu7veVdAhO4nM6e2PI",
          },
        }
      );
      const data = await response.json();

      // Filter out dogs that have banned attributes
      const filteredDogs = data.filter((dog) => {
        return !banList.some(
          (bannedValue) =>
            dog.breeds[0]?.breed_group
              ?.toLowerCase()
              .includes(bannedValue.toLowerCase()) ||
            dog.breeds[0]?.height?.metric
              ?.toLowerCase()
              .includes(bannedValue.toLowerCase()) ||
            dog.breeds[0]?.weight?.metric
              ?.toLowerCase()
              .includes(bannedValue.toLowerCase()) ||
            dog.breeds[0]?.life_span
              ?.toLowerCase()
              .includes(bannedValue.toLowerCase()) ||
            dog.breeds[0]?.bred_for
              ?.toLowerCase()
              .includes(bannedValue.toLowerCase())
        );
      });

      if (filteredDogs.length === 0) {
        alert("No more dogs available with current ban list!");
        return;
      }
      
      const randomDog =
        filteredDogs[Math.floor(Math.random() * filteredDogs.length)];
      setCurrentDog(randomDog);
      setSeenSoFar((prevList) => {
        if (!prevList.includes(randomDog.breeds[0].name)) {
          return [...prevList, randomDog];
        }
        return prevList;
      });
      setDiscoverBtnClicked(true);
    } catch (error) {
      console.error("Error fetching dog:", error);
      alert("Error fetching dog. Please try again.");
    }
  };

  const addToBanList = (value) => {
    setBanList((prevList) => {
      if (prevList.includes(value)) {
        return prevList.filter((item) => item !== value);
      } else {
        return [...prevList, value];
      }
    });
  };

  const removeFromBanList = (value) => {
    setBanList((prevList) => prevList.filter((item) => item !== value));
  };

  const getAttributes = () => {
    const attributes = [];
    for (let [key, value] of Object.entries(currentDog?.breeds[0])) {
      

      if (key === "breed_group"){
        value = currentDog?.breeds[0].breed_group;
        value = " breed group: " + value.trim();
        attributes.push(value);
        continue;
      }

      if (key === "weight"){
        value = currentDog?.breeds[0].weight.metric;
        value = value.trim();
        attributes.push(value);
        continue;
      }

      if (key === "height"){
        value = currentDog?.breeds[0].height.metric;
        value = value.trim();
        attributes.push(value);
        continue;
      }

      if (key === "life_span"){
        value = currentDog?.breeds[0].life_span;
        value = value.trim();
        attributes.push(value);
        continue;
      }

      if (key === "bred_for"){
        value = currentDog?.breeds[0].bred_for;
        value = value.trim();
        attributes.push(value);
        continue;
      }
    }


    return attributes;
  };

  return (
    <div className="app">
      <div className="seen-list">
        <h2>What have we seen so far?</h2>
        <ul>
          {seenSoFar.map((item) => (
            <li key={item.id}>
              <div className="seen-dog-info">
                <img src={item.url} alt="Seen Dog" />
                <p>{`A ${item.breeds[0].name} Dog`}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="current-dog">
        <h1>Dog Stumble Upon</h1>
        <p>A doggy adventure discovering new dogs</p>

        {discoverBtnClicked && (
          <div className="current-dog-info">
            <h2>{currentDog?.breeds[0]?.name}</h2>
            <div className="attribute-container">
              {getAttributes().map((attribute) => (
                <button onClick={() => addToBanList(attribute)} key={attribute}>{attribute}</button>
              ))}
            </div>
            <img src={currentDog?.url} alt="Current Dog" />
          </div>
        )}

        <button onClick={fetchRandomDog}>Discover a New Dog</button>
      </div>

      <div className="ban-list">
        <h2>Ban List</h2>
        <ul>
          {banList.map((item) => (
            <li onClick={() => removeFromBanList(item)} key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
