using System;
using static H5.Core.dom;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class TreeAppContext
    {
        private readonly IClock clock;
        private readonly TreeEnvironmentConfig config;
        private readonly TreeStateStore treeStateStore;
        private readonly TreeStateFactory treeStateFactory;
        private readonly SharedDrawingState sharedDrawingState;

        public TreeAppContext(
            IClock clock,
            TreeEnvironmentConfig config,
            TreeStateStore treeStateStore,
            TreeStateFactory treeStateFactory,
            SharedDrawingState sharedDrawingState
        )
        {
            this.clock = clock ?? throw new ArgumentNullException(nameof(clock));
            this.config = config ?? throw new ArgumentNullException(nameof(config));
            this.treeStateStore = treeStateStore ?? throw new ArgumentNullException(nameof(treeStateStore));
            this.treeStateFactory = treeStateFactory ?? throw new ArgumentNullException(nameof(treeStateFactory));
            this.sharedDrawingState = sharedDrawingState ?? throw new ArgumentNullException(nameof(sharedDrawingState));
        }

        public TreeBehaviourEngine TreeBehaviour { get; private set; }

        public void Initialize()
        {
            var state = treeStateStore.Get();

            if (state is null)
            {
                state = treeStateFactory.CreateTree();
                treeStateStore.Set(state);
            }

            TreeBehaviour = new TreeBehaviourEngine(config, state);
        }

        public void ResetTree()
        {
            var state = treeStateFactory.CreateTree();
            treeStateStore.Set(state);
            TreeBehaviour = new TreeBehaviourEngine(config, state);
        }

        public void UpdateGameState()
        {
            TreeBehaviour.Update(clock.Now());
        }

        public void UpdatePreRender()
        {
            sharedDrawingState.GrowthControl = TreeBehaviour.TreeState.Growth;
            sharedDrawingState.WaterAmount = Math.Min(1, TreeBehaviour.TreeState.WaterLevel);
            sharedDrawingState.ThicknessControl = TreeBehaviour.TreeState.Health;
            sharedDrawingState.WaterDelta = TreeBehaviour.WaterDelta;
            sharedDrawingState.IsDead = TreeBehaviour.TreeState.Health == 0;
            sharedDrawingState.Seed = TreeBehaviour.TreeState.Seed;
        }

        public void Water()
        {
            TreeBehaviour.Water();
            treeStateStore.Set(TreeBehaviour.TreeState);
        }

        public void AutoSave()
        {
            treeStateStore.Set(TreeBehaviour.TreeState);
        }
    }
}
