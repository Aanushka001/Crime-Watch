import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { getUserProfile } from '../../utils/api';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  color: #fff;
`;

const ProfileHeader = styled.h2`
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #f9a825;
`;

const ProfileDetails = styled.div`
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  margin-bottom: 10px;
`;

const ProfileBio = styled.div`
  margin-bottom: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #f9a825;
`;

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const data = await getUserProfile();
          setProfileData(data);
        } catch (error) {
          // Handle error silently
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || authLoading) {
    return (
      <ProfileContainer>
        <LoadingMessage>Loading profile...</LoadingMessage>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>User Profile</ProfileHeader>
      
      <ProfileDetails>
        <DetailItem>
          <strong>Name:</strong> {user?.displayName || 'N/A'}
        </DetailItem>
        <DetailItem>
          <strong>Email:</strong> {user?.email || 'N/A'}
        </DetailItem>
        <DetailItem>
          <strong>User ID:</strong> {user?.uid || 'N/A'}
        </DetailItem>
        <DetailItem>
          <strong>Account Created:</strong> {profileData?.createdAt ? new Date(profileData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
        </DetailItem>
      </ProfileDetails>

      <ProfileBio>
        <strong>Account Status:</strong>
        <p>Active and verified</p>
      </ProfileBio>
    </ProfileContainer>
  );
};

export default ProfilePage;