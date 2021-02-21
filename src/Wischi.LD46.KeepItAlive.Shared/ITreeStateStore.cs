namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public interface ITreeStateStore
    {
        void Set(TreeState treeState);
        TreeState Get();
    }
}
