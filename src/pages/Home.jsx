import { useContext, useEffect, useState } from "react";
import CreatePollModal from "../components/CreatePollModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFilter } from "@fortawesome/free-solid-svg-icons";
import { getpoll, addVote, removeCurrentPoll } from "../services/pollService";
import { toast } from "react-toastify";
import { getUser } from "../services/userService";
import { authContext } from "../context/AuthContext";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setuserId] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("all");

  const { token } = useContext(authContext);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddPoll = (newPoll) => {
    setPolls((prevPolls) => [newPoll, ...prevPolls]);
  };

  const handleVote = async (pollId, optionId) => {
    try {
      const response = await addVote(pollId, optionId);
      if (response.status === 200) {
        toast.success(response.data.message, { theme: "colored" });
        setPolls((prevPolls) =>
          prevPolls.map((poll) => {
            if (poll._id === pollId) {
              return {
                ...poll,
                options: poll.options.map((option) =>
                  option._id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                ),
              };
            }
            return poll;
          })
        );
      }
    } catch (error) {
      console.log("err", error);

      console.error("Failed to submit vote:", error);
      toast.error("Failed to submit vote. Please try again.", {
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await getpoll();
        setPolls(response.data.polls || []);
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      }
    };
    fetchPolls();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser(token);
      setuserId(response.user.id);
    };
    fetchUser();
  }, [token]);

  const calculatePercentage = (votes, totalVotes) =>
    totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : 0;

  const handleOptionChange = (pollId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pollId]: optionId,
    }));
  };

  const handleRemovePoll = async (pollId) => {
    try {
      const response = await removeCurrentPoll(pollId);
      if (response.status === 200) {
        toast.success(response.data.message);
        setPolls((prev) => prev.filter((poll) => poll._id !== pollId));
      }
    } catch (error) {
      console.error("Failed to remove poll:", error);
    }
  };

  const filteredPolls = polls.filter((poll) => {
    const matchesSearchTerm = poll.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      if (filterOption === "all") {
        return matchesSearchTerm;
      }
      if (filterOption === "userAdded") {
        return matchesSearchTerm && poll.userId === userId;
      }

    return false;
  });

  const handleFilterOption = (option) => {
    setIsDropdownOpen(false);
    setFilterOption(option);
  };

  return (
    <>
      <div className="flex justify-center items-center mt-20">
        <div className="flex items-center space-x-10">
          <div>
            <button
              onClick={openModal}
              className="bg-gray-300 px-4 py-2 hover:bg-gray-400 rounded-md shadow-md font-bold"
            >
              Create Poll
            </button>
          </div>

          <input
            className="border p-2 rounded-md w-[500px]"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="relative">
            <div className="flex items-center space-x-2 cursor-pointer bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
              <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
              <span
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="font-medium"
              >
                Filter
              </span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                <ul className="py-1">
                  <li
                    onClick={() => handleFilterOption("all")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All Polls
                  </li>
                  <li
                    onClick={() => handleFilterOption("userAdded")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Your Polls
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-5 h-[73vh] mt-10 w-full overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );

            return (
              <div
                key={poll._id}
                className="bg-slate-50 w-full p-5 rounded-lg shadow-xl flex flex-col justify-between"
              >
                <h2 className="flex justify-between text-xl font-semibold text-gray-800 mb-4">
                  {poll.question}
                  {poll.userId === userId && (
                    <FontAwesomeIcon
                      onClick={() => handleRemovePoll(poll._id)}
                      className="h-8 w-8"
                      icon={faClose}
                    />
                  )}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVote(poll._id, selectedOptions[poll._id]);
                  }}
                >
                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const percentage = calculatePercentage(
                        option.votes,
                        totalVotes
                      );

                      return (
                        <div key={option._id} className="space-y-2">
                          <label className="flex items-center space-x-3 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={`poll-${poll._id}`}
                              className="form-radio h-5 w-5 text-blue-600"
                              value={option._id}
                              checked={selectedOptions[poll._id] === option._id}
                              onChange={() =>
                                handleOptionChange(poll._id, option._id)
                              }
                            />
                            <span className="text-gray-700">
                              {option.option}
                            </span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <div className="relative w-full bg-gray-200 rounded-full h-2.5">
                              <div className="relative w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="absolute top-0 left-0 h-full rounded-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>

                            <span className="text-md text-gray-500">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="submit"
                    className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                    disabled={!selectedOptions[poll._id]}
                  >
                    Submit Vote
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <CreatePollModal
          closeModal={closeModal}
          handleAddPoll={handleAddPoll}
        />
      )}
    </>
  );
}

export default Home;
