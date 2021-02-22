using System.Threading.Tasks;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public static class TaskX
    {
        // Workaround for missing Task.CompletedTask
        // https://github.com/bridgedotnet/Bridge/issues/3201
        public static Task CompletedTask { get; } = Task.Delay(0);
    }
}
