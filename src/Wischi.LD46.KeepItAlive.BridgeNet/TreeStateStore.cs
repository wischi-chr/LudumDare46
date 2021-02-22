using Bridge.Html5;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeStateStore
    {
        private readonly string treeStateKey;
        private readonly string tokenKey;

        private readonly KVS kvs;

        public TreeStateStore(string prefix)
        {
            treeStateKey = prefix + ".TreeStateV1";
            tokenKey = prefix + ".Token";

            kvs = new KVS();
        }

        public event EventHandler SyncTokenChanged;

        public string SyncToken
        {
            get => Window.LocalStorage.GetItem(tokenKey) as string;
            set
            {
                Window.LocalStorage.SetItem(tokenKey, value);
                SyncTokenChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public async Task<TreeState> Get()
        {
            var cloudState = await StateFromKvsAsync();
            return cloudState ?? LoadFromLocalStorage();
        }

        public async Task Set(TreeState treeState)
        {
            SaveToLocalStorage(treeState);
            await SaveStateToKvsAsync(treeState);
        }

        private void SaveToLocalStorage(TreeState treeState)
        {
            if (treeState is null)
            {
                Window.LocalStorage.RemoveItem(treeStateKey);
                return;
            }

            var treeJson = JsonConvert.SerializeObject(treeState);
            Window.LocalStorage.SetItem(treeStateKey, treeJson);
        }

        private TreeState LoadFromLocalStorage()
        {
            var treeJson = Window.LocalStorage.GetItem(treeStateKey) as string;

            if (string.IsNullOrWhiteSpace(treeJson))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<TreeState>(treeJson);
        }

        private async Task<TreeState> StateFromKvsAsync()
        {
            var resp = await kvs.GetAsync(SyncToken);

            if (resp.StatusCode == 200)
            {
                if (string.IsNullOrWhiteSpace(resp.Content))
                {
                    return null;
                }

                return JsonConvert.DeserializeObject<TreeState>(resp.Content);
            }

            if (resp.StatusCode >= 400 && resp.StatusCode <= 499)
            {
                // not found, get new token
                resp = await kvs.NewAsync();

                if (resp.StatusCode == 200)
                {
                    SyncToken = resp.Content;
                    return null;
                }
                else
                {
                    throw new Exception("Failed to get new token");
                }
            }

            throw new Exception("Failed to get tree state from keystore");
        }

        private async Task SaveStateToKvsAsync(TreeState state)
        {
            var data = state == null ? string.Empty : JsonConvert.SerializeObject(state);

            var resp = await kvs.SetAsync(SyncToken, data);

            if (resp.StatusCode != 200)
            {
                resp = await kvs.NewAsync();

                if (resp.StatusCode == 200)
                {
                    await kvs.SetAsync(SyncToken, data);
                }
            }
        }

        //var res = Window.LocalStorage.GetItem(config.SettingPrefix + ".Token") as string;
        //var empf = res == null;
        //Console.Write("Res: " + empf);

        //Task.
        //Task.FromCallback()


    }

    public class HttpResponse
    {
        public HttpResponse(ushort statusCode, string content)
        {
            StatusCode = statusCode;
            Content = content;
        }

        public ushort StatusCode { get; }
        public string Content { get; }
    }

    public class KVS
    {
        private const string baseUrl = "https://api.keyvalue.xyz/";
        private const int baseUrlLen = 25;
        private const string suffix = "tree";

        public async Task<HttpResponse> NewAsync()
        {
            var url = GetUrlWithToken("new");

            var xhr = new XMLHttpRequest();
            xhr.Open("POST", url);

            var source = GetCompletionSourceForRequest(xhr);
            xhr.Send();

            var resp = await source.Task;

            if (resp.StatusCode != 200)
            {
                return resp;
            }

            return new HttpResponse(200, GetTokenFromUrl(resp.Content));
        }

        public Task<HttpResponse> GetAsync(string token)
        {
            var url = GetUrlWithToken(token);

            var xhr = new XMLHttpRequest();
            xhr.Open("GET", url);

            var source = GetCompletionSourceForRequest(xhr);
            xhr.Send();

            return source.Task;
        }

        public Task<HttpResponse> SetAsync(string token, string value)
        {
            var url = GetUrlWithToken(token);

            var xhr = new XMLHttpRequest();
            xhr.Open("POST", url);

            var source = GetCompletionSourceForRequest(xhr);
            xhr.Send(value);

            return source.Task;
        }

        private static TaskCompletionSource<HttpResponse> GetCompletionSourceForRequest(XMLHttpRequest xhr)
        {
            var source = new TaskCompletionSource<HttpResponse>();

            xhr.OnLoad = a =>
            {
                var res = new HttpResponse(xhr.Status, xhr.ResponseText);
                source.SetResult(res);
            };

            xhr.OnAbort = a => source.SetCanceled();
            xhr.OnError = a => source.SetException(new Exception("Error"));
            xhr.OnTimeout = a => source.SetException(new Exception("Timeout"));

            return source;
        }

        private static string GetUrlWithToken(string token)
        {
            return $"{baseUrl}{token}/{suffix}";
        }

        private static string GetTokenFromUrl(string url)
        {
            var path = url.Substring(baseUrlLen);
            var indexSlash = path.IndexOf('/');
            return path.Substring(0, indexSlash);
        }
    }
}
