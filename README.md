# CollabCoder

We introduce **CollabCoder**, a system leveraging **Large Language Models (LLMs)** to support three CQA stages: **independent open coding**, **iterative discussions**, and **the development of a final codebook**. 

- In the **independent open coding phase**, CollabCoder provides AI-generated code suggestions on demand and allows users to record coding decision-making information (e.g. keywords and certainty) as support for the process. 

- During the **discussion phase**, CollabCoder helps to build mutual understanding and productive discussion by sharing coding decision-making information within the team. It also helps to quickly identify agreements and disagreements through quantitative metrics, in order to build a final consensus. 

- During the **code grouping phase**, CollabCoder employs a top-down approach for primary code group recommendations, reducing the cognitive burden of generating the final codebook.

![teaser.png](figure/teaser.png)

## Installation

```
bash scripts/install.sh
```

## Add .env to backend
Modify the `.env` according to server settings.

## Start Servers
- run the backend Express server and frontend react server
```
bash scripts/start.sh
```


## Related papers 

[CollabCoder: A GPT-Powered Workflow for Collaborative Qualitative Analysis](https://arxiv.org/abs/2304.07366)

[CoAIcoder: Examining the Effectiveness of AI-assisted Human-to-Human Collaboration in Qualitative Analysis](https://arxiv.org/abs/2304.05560)



## Citation

@misc{gao2023collabcoder,
      title={CollabCoder: A GPT-Powered Workflow for Collaborative Qualitative Analysis}, 
      author={Jie Gao and Yuchen Guo and Gionnieve Lim and Tianqin Zhang and Zheng Zhang and Toby Jia-Jun Li and Simon Tangi Perrault},
      year={2023},
      eprint={2304.07366},
      archivePrefix={arXiv},
      primaryClass={cs.HC}
}



Please contact the author (https://gaojie058.github.io/) for any questions: gaojie056@gmail.com
