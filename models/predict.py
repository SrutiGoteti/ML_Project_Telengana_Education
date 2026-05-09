import pickle


def load_model(model_path):
    with open(model_path, "rb") as f:
        return pickle.load(f)


def predict(model, inputs):
    return model.predict(inputs)
