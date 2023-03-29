using System;

using static H5.Core.dom;
using static H5.Core.es5;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeStateStore
    {
        private readonly string treeStateKey;
        private readonly string tokenKey;

        public TreeStateStore(string prefix)
        {
            treeStateKey = prefix + ".TreeStateV1";
            tokenKey = prefix + ".Token";
        }

        public event EventHandler SyncTokenChanged;

        public string SyncToken
        {
            get => window.localStorage.getItem(tokenKey);
            set
            {
                window.localStorage.setItem(tokenKey, value);
                SyncTokenChanged?.Invoke(this, EventArgs.Empty);
            }
        }

        public TreeState Get()
        {
            return LoadFromLocalStorage();
        }

        public void Set(TreeState treeState)
        {
            SaveToLocalStorage(treeState);
        }

        private void SaveToLocalStorage(TreeState treeState)
        {
            if (treeState is null)
            {
                window.localStorage.removeItem(treeStateKey);
                return;
            }

            var treeJson = JSON.stringify(treeState);
            window.localStorage.setItem(treeStateKey, treeJson);
        }

        private TreeState LoadFromLocalStorage()
        {
            var treeJson = window.localStorage.getItem(treeStateKey);

            if (string.IsNullOrWhiteSpace(treeJson))
            {
                return null;
            }

            return JSON.parse(treeJson).As<TreeState>();
        }
    }
}
