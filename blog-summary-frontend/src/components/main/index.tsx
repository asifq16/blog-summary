import React, { useEffect, useState } from "react";
import { Card, Input, Collapse, List, Tag, Spin, Button } from "antd";
import './index.css';
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";

export const Main: React.FC = () => {
  /**
   * * Note already visited summaries can be retrieved with article code after saving any summary
   * ! As it is on page/module code state management is not required
   */

  const [search, setSearch] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(null);
  const { Panel } = Collapse;

  const onSearchFieldChange = (val) => {
    const urlArray = val.target.value.split(',');
    setSearch(urlArray);
  }

  // Get Summary with article url
  const onSearch = async () => {
    setLoading(true);
    const getTextfromUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/article/article-summary`,{
      urls:search
    },{
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    });
    setLoading(false);
    setSummaries(getTextfromUrl.data.summaries);
  }

  // Save summary
  const onSave = async (index, bulkSave) => {
    console.log(process.env);
    const getTextfromUrl = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/article`,{
      data:bulkSave?summaries:[summaries[index]]
    },{
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    });
    if(bulkSave){
      alert(`Successfully saved with the article details: ~ ${getTextfromUrl.data.articleData.map((ele, index) => (`\n (${index}) URL: ${ele.url} || "View Code" : ${ele.code}`))} ~`);
    } else {
      alert(`Successfully saved with the article details:\n  (0) URL: ~ ${getTextfromUrl.data.articleData[0].url} ~ View Code: ~ ${getTextfromUrl.data.articleData[0].code} ~`);
    }
  };

  // When app is visited via extension
  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    if(searchParams.get('url')){
      setSearch([searchParams.get('url')]);
    }
  },[]);

  return (
    <div className="body">
      <h1 className="heading"> Blog Summary</h1>
      <br/>
      <div className="outer-placement">
          <Card className="input-card">
            <Tag color="cyan">Enter comma separated Urls</Tag><br />
            <br />
            <Input className="search" onChange={onSearchFieldChange} value={search} size="large" placeholder="Enter Doc URL" multiple/>
            <br />
            <br />
            <Button className="search-button" onClick={onSearch}>
              Search
            </Button>
            <br />
            <br />
            <List
              size="large"
              header={<div>Urls</div>}
              bordered
              dataSource={search}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
          <Card className="input-card">
            {loading?<><Spin className="spin" tip="Summarizing Content For You" size="small">
          </Spin><br /></>:
            <><div>Summaries</div><br/><Collapse bordered={false} defaultActiveKey={['0']}>
              {summaries.map((data, index) => {
                return (
                  <Panel header={data.url} key={index}>
                    {data.summary}
                    <br />
                    <br />
                    <div className="save-icon" onClick={() => onSave(index, false)}><DownloadOutlined /></div>
                  </Panel>
                );
              })}
            </Collapse></>}
            {summaries.length>0?<><br /><Button className="search-button" onClick={()=>onSave(0, true)}>
            Save All Summary
          </Button></>:''}
          </Card>
      </div>
    </div>
  );
};
